
import errorHandler from "../../utills/errorhandler.js";
import Cart from "../../models/cart.js";
import Joi from "joi";


   const Resveration =  async  (req,resp,next)=>{

    //Validation
    const CartSchema = Joi.object({
    totalPrice: Joi.number().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    reason : Joi.string().required(),
    location :Joi.string().required(),
  }).unknown();


  // Validation Error Show
  const { error } = CartSchema.validate(req.body);
  if (error) { return next(new errorHandler(error.message, 400,)); }



  new Cart({ ...req.body, user_id :req.user._id })
    .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
    .catch((error) => { return next(new errorHandler(error.message, 400,)); })

}

  

    
  




export default  Resveration;