
import Cart from "../../models/cart.js";
import User from '../../models/user.js'
import Joi from "joi";
import transaction from "../../models/transaction.js";
import errorHandler from "../../utills/errorhandler.js";
import { config } from 'dotenv';
// import  Stripe  from 'stripe';
config(); 

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// const stripeClient = Stripe(stripeSecretKey);

const Payment = {

  sheet :async  (req,resp,next)=>{

//   const { amount, currency ,order_id} = req.body;
//   console.log(currency);

//   const user = await User.findById({ _id: req.user._id }) ;
//   // Use an existing Customer ID if this is a returning omer.
//   const customer = await stripeClient.customers.create({ });
//   const ephemeralKey = await stripeClient.ephemeralKeys.create(
//     { customer: customer.id },
//     { apiVersion: '2023-08-16'},
//   );
//   try {
//     const paymentIntent = await stripeClient.paymentIntents.create({
//       amount: amount,
//       currency: currency,
//       customer: customer.id,
//       payment_method_types: ['card'], // Specify the payment method types you accept, e.g., 'card'

//     });
//    if(paymentIntent){ Cart.findByIdAndUpdate( { _id: order_id }, {  status: 'onBoarding' }).exec()
// }
//     resp.json({
//       paymentIntent: paymentIntent.client_secret,
//       ephemeralKey: ephemeralKey.secret,
//       customer: customer.id,
//     });
//   } catch (error) {
//     // Handle the error
   
//     resp.status(500).json({ error: 'An error occurred while creating the Payment Intent.' });
//   }
},


  transaction  : async  (req,resp,next)=>{
     //Validation
     const CartSchema = Joi.object({
      transactionId : Joi.string().required(),
      orderId:Joi.string().required(),
    });
  
  
    // Validation Error Show
    const { error } = CartSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }

    new transaction({ ...req.body, user_id :req.user._id })
    .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
    .catch((error) => { return next(new errorHandler(error.message, 400,)); })
}
  }

export default Payment;
