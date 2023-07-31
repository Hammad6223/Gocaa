
import User from "../../models/user.js";
import errorHandler from "../../utills/errorhandler.js";
import Joi from "joi";
import cloudinary from "../../utills/cloudinaryConfig.js";




  const DataReset = {
  
     verifyOtp: async  (req,resp,next)=>{

     //Validation
       const registerSchema = Joi.object({
        // email:     Joi.string().email().required(),
        otp:  Joi.string().min(6).max(6).required(),
      });
  
  
      // Validation Error Show
      const { error } = registerSchema.validate(req.body);
      if(error){   return next(new errorHandler(error.message,400,));  }

     const user =  await User.findOne({otp:req.body.otp})
     if(!user) {  return next(errorHandler.unAuthorized()); }

     if (user.otp !== req.body.otp || user.otpExpiration < new Date()) 
     { return next(new errorHandler('Invalid OTP Please try again..',400,));   }

     else{ return next(new errorHandler('Successfully',200,)); }

      },
    

       // Edit Profile
    setPassword : async  (req,resp,next)=>{

      
      //Validation
     const registerSchema = Joi.object({
        email:     Joi.string().email().required(),
        password:  Joi.string().min(3).max(8).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).error( err => { err[0].message= "Confirm Password must match the password"; return err; } )
      });
  
  
      // Validation Error Show
      const { error } = registerSchema.validate(req.body);
      if(error){   return next(new errorHandler(error.message,400,));  }

      
      const user = await User.findOne({ email: req.body.email });
      if (!user) { return next(errorHandler.unAuthorized()) ;}

      user.password = req.body.password;
      user.otp = undefined;
      user.otpExpiration = undefined;

        // user updated
      await user.save()
      .then( () =>{ return next(new errorHandler('Sucessfully', 200)); })
      .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 

    }


      

}
      export default DataReset 



 

   