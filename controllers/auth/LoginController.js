
import User from "../../models/user.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import bcrypt from 'bcryptjs'
import  jwt  from "jsonwebtoken";

// Import .env file
import { config } from "dotenv";
config();


 const LoginController = async (req,resp,next)=>{

      //Validation
      const registerSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      fcmToken: Joi.string().required(),
      });


    // Validation Error Show
    const { error } = registerSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }

    const { email, password ,fcmToken} = req.body;
  

    // Find User
    const user = await User.findOne({ email: email }) ;


    if (!user)  { return next(errorHandler.wrongCredentials()) }
    
    // Compare Password
    const doMatch =  await  bcrypt.compare(password,user.password);
  
    if (!doMatch)     { return  next(errorHandler.wrongCredentials()) } 

    // token generate
    jwt.sign( {_id:user._id,role: user.role }, process.env.JWT_SECRET_KEY , process.env.JWT_EXPIRY_KEY  ,(err,token) =>{

    if(err){ return next(new errorHandler(err.message, 401)); }   
    else {   
      // fcm token
    User.findByIdAndUpdate( { _id: user._id, },  { $addToSet: { fcmTokens: fcmToken } },).exec()
      .then(() => { return next(new errorHandler(token, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

    }
 }); 
    }


     
export default LoginController;