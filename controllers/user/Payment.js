
import Stripe from "stripe";
import Cart from "../../models/cart.js";
import User from '../../models/user.js'



// Access the Stripe secret key from the environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;


// Now you can use `stripeSecretKey` in your Stripe client setup
const stripeClient = Stripe(stripeSecretKey);

const Payment = async (req, resp, next) => {
  const { amount, currency ,order_id} = req.body;
  console.log(currency);

  const user = await User.findById({ _id: req.user._id }) ;
  // Use an existing Customer ID if this is a returning omer.
  const customer = await stripeClient.customers.create({
    email:user.email
  });
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
