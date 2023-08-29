import User from "../../models/user.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import bcrypt from 'bcryptjs'

  
 const SignupController = async (req,resp,next)=>{


      //Validation
    const registerSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName:  Joi.string().required(),
      email:     Joi.string().email().required(),
      password:  Joi.string().min(3).max(8).required(),
      confirm_password: Joi.string().valid(Joi.ref('password')).error( err => { err[0].message= "Confirm Password must match the password"; return err; } )
    });


    // Validation Error Show
    const { error } = registerSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }

    // Email unique check
    const user = await User.exists({email: req.body.email})
    if(user) { return next(new errorHandler('User email already exist',401)); }


    // Get Body Data
    const {firstName,lastName,email,password} = req.body;

    //  Password Bcrypt
    const HashedPassword =  await bcrypt.hash(password,12);

    const otp = await otpGen();

    otp = otp;
    otpExpiration = new Date(Date.now() + 10 * 60 * 1000); 

    new User({
      firstName,
      lastName,
      email,
      password :HashedPassword,
      otp: otp,
      otpExpiration : otpExpiration
    })
     .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
     .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
     
   }

     
export default SignupController