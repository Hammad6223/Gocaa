import Driver from "../../models/driver.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";

  
  const DataDriver = {
 
  addDriver : async (req,resp,next)=>{

      //Validation
    const DriverSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName:  Joi.string().required(),
      email:     Joi.string().email().required(),
      contact :  Joi.string().required(),
      ssn:       Joi.string().pattern(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/).messages({'string.pattern.base': 'ssn must be in the format XXX-XX-XXXX' }),
      street :   Joi.string().required(),
      city:      Joi.string().required(),
      state:     Joi.string().required(),
      country:   Joi.string().required(),
      zip:       Joi.number().required(),
      perHour:   Joi.number().required(),
     }).unknown();
 
  
    // Validation Error Show
    const { error } = DriverSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }


    // Email unique check
    const user= await Driver.exists({email: req.body.email})
    if(user) { return next(new errorHandler('User email already exists',401)); }

    // Upload Cloudianry

    const image = await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" });
    const licenseCopy = await cloudinary.v2.uploader.upload(req.files['licenseCopy'][0].path, { folder: "Gocaltity" });
 

    new Driver({ ...req.body, image : image.public_id, licenseCopy : licenseCopy.public_id })
    .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
     
    },
  
    // View Driver
     ViewDriver  : async (req,resp,next)=>{

    await Driver.find({}).exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler("Something Went wrong", 400));  }); 

    }


  }
  export default DataDriver