
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
        zip:       Joi.number(),
        }).unknown();

         
         
          // Validation Error Show
          const { error } = registerSchema.validate(req.body);
          if(error){   return next(new errorHandler(error.message,400,));  }
      
         //   Email unique check

         try {
          // Check if the new email is unique
          const existingUser = await User.findOne({email: req.body.email});
          if (existingUser && existingUser._id.toString() !== req.user._id) {
            return next(new errorHandler('User email already exists',401)); }     
          
            // Destroy old image             
          if(existingUser.image) { cloudinary.uploader.destroy(existingUser.image)} 
          }
          catch (error) {  console.error(error);    }
      
         if(req.file){

         await cloudinary.v2.uploader.upload(req.file.path, { folder: "Gocaltity" }, async (error, result) => {
        
          if(error){   return next(new errorHandler(error.message,400,));  } 
          if (result.public_id) {  req.body.image = result.public_id; 
          // delete multer image
          await fs.remove(req.file.path); 
          }
         })
        }

        console.log(req.body)
          // Update Data

          User.findByIdAndUpdate( req.user._id , req.body,{ runValidators: true } ,)
         .then( () =>{ return next(new errorHandler('Successfully', 200)); })
         .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
        }
    
  
  }


    

    
      export default DataProfile



 

   