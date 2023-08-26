import Driver from "../../models/driver.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import  fs  from "fs-extra";
  
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

    if(!req.files['image']){return next(new errorHandler(' image is required',400)); }
    if(!req.files['licenseCopy']){return next(new errorHandler('License copy is required',400)); }
    

    // Email unique check
    const user= await Driver.exists({email: req.body.email})
    if(user) { return next(new errorHandler('User email already exists',401)); }

    // Upload Cloudianry

    const image = await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" });
    const licenseCopy = await cloudinary.v2.uploader.upload(req.files['licenseCopy'][0].path, { folder: "Gocaltity" });
  
    // delete multer image
   await fs.remove(req.files['image'][0].path); 
   await fs.remove(req.files['licenseCopy'][0].path); 


    new Driver({ ...req.body, image : image.public_id, licenseCopy : licenseCopy.public_id })
    .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
     
    },
  
    // View Driver
     ViewDriver  : async (req,resp,next)=>{

    await Driver.find({}).exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler("Something Went wrong", 400));  }); 

    },

    // Edit Driver
  editDriver: async (req, resp, next) => {

    
    //Validation
    const registerSchema =  Joi.object({
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
    const { error } = registerSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }


    const existingUser = await Driver.findById(req.params.id);
    // Destroy old image             
    if (existingUser.image) { cloudinary.uploader.destroy(existingUser.image) }
    if (existingUser.companyLogo) { cloudinary.uploader.destroy(existingUser.companyLogo) }

    //  Image validation
    if (req.files.image) {
      const image = await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" });
      if (image) { req.body.image = image.public_id }
      // delete multer image
      await fs.remove(req.files['image'][0].path);
    }

    // license Copy
    if (req.files.licenseCopy) {
      const companyLogo = await cloudinary.v2.uploader.upload(req.files['licenseCopy'][0].path, { folder: "Gocaltity" });
      if (companyLogo) { req.body.companyLogo = companyLogo.public_id }
      // delete multer image
      await fs.remove(req.files['licenseCopy'][0].path);

    }

    // Update Data

    Driver.findByIdAndUpdate(req.params.id, req.body, { runValidators: true },)
      .then((data) => { return next(new errorHandler('succesfully', 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });
  },




  // Detail Driver
  DetailDriver: async (req, resp, next) => {

  
console.log(req.body)
       await Driver.findById({ _id: req.params.id }).exec()
      .then( (data) =>{ return next(new errorHandler(data, 200)); })
      .catch((error) =>{return next(new errorHandler("Something Went wrong", 400));  }); 



  }




  }
  export default DataDriver