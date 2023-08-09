import Package from "../../models/package.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import  fs  from "fs-extra";
import Feature from "../../models/feature.js";
  
 const DataPackage = {
 
     addPackage : async (req,resp,next)=>{
    

     // check image
    if(!req.file){return next(new errorHandler(' image is required',400)); }
    if(!req.body.vehicle_id) {return next(new errorHandler('please at least one vehicle add',400)); }
    if(!req.body.service_id) {return next(new errorHandler('please at least one service add',400)); }


      //Validation
    const PackageSchema = Joi.object({
        title:  Joi.string().required(),
        price: Joi.number().required(),
        vehicleDiscount: Joi.number().required(),
        serviceDiscount: Joi.number().required(),
        
       }).unknown();
 

       // Validation Error Show
       const { error } = PackageSchema.validate(req.body);
       if(error){   return next(new errorHandler(error.message,400,));  }



       // Upload Cloudianry
       await cloudinary.v2.uploader.upload(req.file.path, { folder: "Gocaltity" }, async (error, result) => {
        
        if(error){   return next(new errorHandler(error,400,));  }

        // delete multer image
        await fs.remove(req.file.path); 
        // vehicle_id :JSON.parse(req.body.vehicle_id) , service_id :JSON.parse(req.body.service_id)
       new Package({ ...req.body, image : result.public_id })
      .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
      .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
      
      })
    },


      // View Package
      viewPackage : async (req,resp,next)=>{

  

      Package.find({}).populate({path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}).populate('service_id').exec()
      .then( (data) =>{ return next(new errorHandler(data, 200)); })
      .catch((error) =>{
        console.log(error);
        return next(new errorHandler("Something Went wrong", 400));  }); 


      },




     

 }

 export default DataPackage;