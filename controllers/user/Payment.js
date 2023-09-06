
import stripe from "stripe";

// Initialize Stripe with your API key
const stripeClient = stripe('sk_test_51NiFpUAGRNlD1CLmzzBAgYZBsMdKGcrYVEYdO7zxSXPmYRub4M5cOTlN5eXRudVOSlr9eRW06LyC0Hemk2MUJwDd00NZzLzOhM');

const Payment = async (req, resp, next) => {
  const { amount, currency } = req.body;
  console.log(currency);
  // Use an existing Customer ID if this is a returning omer.
  const customer = await stripeClient.customers.create();
  const ephemeralKey = await stripeClient.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2023-08-16' },
  );
  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: ['card'], // Specify the payment method types you accept, e.g., 'card'

    });

    resp.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    // Handle the error
    console.error(error);
    resp.status(500).json({ error: 'An error occurred while creating the Payment Intent.' });
  }
};

export default Payment;
