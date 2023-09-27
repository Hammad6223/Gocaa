import  Service from "../../models/service.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import  fs  from "fs-extra";
  
  const DataService = {
 
  addService : async (req,resp,next)=>{

    console.log(req.body)
      //Validation
    const ServiceSchema = Joi.object({
      title: Joi.string().required(),
      price:  Joi.number().required(),
     }).unknown();
 
  
    // Validation Error Show
    const { error } = ServiceSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }

     // check image
    if(!req.file){return next(new errorHandler(' image is required',400)); }

    // Upload Cloudianry

    const image = await cloudinary.v2.uploader.upload(req.file.path, { folder: "Gocaltity" });
   
    // delete multer image
    await fs.remove(req.file.path); 

    new Service({ ...req.body, image : image.public_id,  })
    .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
     
    },
  
    // View Driver
     ViewService : async (req,resp,next)=>{

    await Service.find({}).sort({ createdAt: -1 }).exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler("Something Went wrong", 400));  }); 

    }


  }
  export default DataService