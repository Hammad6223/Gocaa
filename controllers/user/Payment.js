
import stripe from "stripe";
import Cart from "../../models/cart.js";

// Initialize Stripe with your API key
const stripeClient = stripe('sk_test_51NiFpUAGRNlD1CLmzzBAgYZBsMdKGcrYVEYdO7zxSXPmYRub4M5cOTlN5eXRudVOSlr9eRW06LyC0Hemk2MUJwDd00NZzLzOhM');

const Payment = async (req, resp, next) => {
  const { amount, currency ,order_id} = req.body;
  console.log(currency);
  // Use an existing Customer ID if this is a returning omer.
  const customer = await stripeClient.customers.create();
  const ephemeralKey = await stripeClient.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2023-08-16'},
  );
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: ['card'], // Specify the payment method types you accept, e.g., 'card'

    });
   if(paymentIntent){ Cart.findByIdAndUpdate( { _id: order_id }, {  status: 'onBoarding' }).exec()
}
    resp.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    // Handle the error
   
    resp.status(500).json({ error: 'An error occurred while creating the Payment Intent.' });
  }
};

export default Payment;
