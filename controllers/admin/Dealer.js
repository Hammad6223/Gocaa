import Dealer from "../../models/dealer.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";

  
  const DataDealer = {
 
  addDealer : async (req,resp,next)=>{

      //Validation
    const DealerSchema = Joi.object({
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
      companyName:Joi.string().required(),
     }).unknown();


    // Validation Error Show
    const { error } = DealerSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }


    // // Email unique check
    // const user= await Dealer.exists({email: req.body.email})
    // if(user) { return next(new errorHandler('User email already exists',401)); }

    // Upload Cloudianry

  //  await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" } ,  async (err, result) => {
  //     if(err) throw err; });
  //  await cloudinary.v2.uploader.upload(req.files['companyLogo'][0].path, { folder: "Gocaltity" },async (err, result) => {
  //     if(err) throw err;});
 

    new Dealer( ...req.body)
    .save().then( () =>{ return next(new errorHandler('Successfully',200,)); })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
     
    },
  
    // View Dealer
     ViewDealer  : async (req,resp,next)=>{

    await Dealer.find({}).exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler("Something Went wrong", 400));  }); 

    }



  }
  export default DataDealer