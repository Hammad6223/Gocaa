
import User from "../../models/user.js";
import errorHandler from "../../utills/errorhandler.js";
import Joi from "joi";
import cloudinary from "../../utills/cloudinaryConfig.js";
import  fs  from "fs-extra";



  const DataProfile = {
  
      viewProfile : async  (req,resp,next)=>{
      User.findById({ _id:req.user._id})
      .then( (data) =>{ return next(new errorHandler(data, 200)); })
      .catch((error) =>{return next(new errorHandler("user not found", 400));  }); 
    
      },
    

       // Edit Profile
      editProfile : async  (req,resp,next)=>{


        //Validation
        const registerSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName:  Joi.string().required(),
            email:     Joi.string().email().required(),
            ssn:       Joi.string().pattern(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/).messages({'string.pattern.base': 'ssn must be in the format XXX-XX-XXXX' }),
            zip:       Joi.number(),
            dateOfBirth: Joi.date().iso().messages({ 'date.base': 'Date of birth must be a valid date', 'date.format': 'Date of birth must be in the format YYYY-MM-DD', }),
        }).unknown();

          // Validation Error Show
          const { error } = registerSchema.validate(req.body);
          if(error){   return next(new errorHandler(error.message,400,));  }
      
      
        

          try {
            // Check if the new email is unique
            const existingUser = await User.findOne({email: req.body.email});
            if (existingUser && existingUser._id.toString() !== req.user._id) {
              return next(new errorHandler('User email already exists',401)); }     
        
            }
            catch (error) {  console.error(error);    }
       
          // Update Data

          User.findByIdAndUpdate( req.user._id , req.body,{ runValidators: true })
         .then( () =>{ return next(new errorHandler('Sucessfully', 200)); })
         .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
         
      },


       //  Edit profile image 

       editProfileImage : async  (req,resp,next)=>{


        // check image
        if(!req.file){return next(new errorHandler('Profile image is required',400)); }

        const user = await  User.findById(req.user._id);
  
        // Destroy old image 
        if (user.image) { cloudinary.uploader.destroy(user.image)}

        // Upload new images
        await cloudinary.v2.uploader.upload(req.file.path, { folder: "Gocaltity" }, async (error, result) => {
        
        if(error){   return next(new errorHandler(error.message,400,));  }
    
        // delete multer image
        await fs.remove(req.file.path); 

        // Update profile 
        User.findByIdAndUpdate( req.user._id ,{image : result.public_id},)   
        .then( () =>{ return next(new errorHandler('Sucessfully', 200)); })
        .catch((error) =>{return next(new errorHandler(error.message, 400));  });

        

        })


       }

}
      export default DataProfile



 

   