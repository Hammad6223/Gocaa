import Dealer from "../../models/dealer.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";

const DataDealer = {

  addDealer: async (req, resp, next) => {


    //Validation
    const DealerSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      contact: Joi.string().required(),
      ssn: Joi.string().pattern(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/).messages({ 'string.pattern.base': 'ssn must be in the format XXX-XX-XXXX' }),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.number().required(),
      companyName: Joi.string().required(),
    }).unknown();


    // Validation Error Show
    const { error } = DealerSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }


    if (!req.files['image']) { return next(new errorHandler(' image is required', 400)); }
    if (!req.files['companyLogo']) { return next(new errorHandler('company copy is required', 400)); }

    // Email unique check
    const user = await Dealer.exists({ email: req.body.email })
    if (user) { return next(new errorHandler('User email already exists', 401)); }

    // Upload Cloudianry

    const image = await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" });
    const companyLogo = await cloudinary.v2.uploader.upload(req.files['companyLogo'][0].path, { folder: "Gocaltity" });


    // delete multer image
    await fs.remove(req.files['image'][0].path);
    await fs.remove(req.files['companyLogo'][0].path);

    new Dealer({ ...req.body, image: image.public_id, companyLogo: companyLogo.public_id })
      .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
      .catch((error) => { return next(new errorHandler(error.message, 400,)); })

  },

  // View Dealer
  ViewDealer: async (req, resp, next) => {

    await Dealer.find({}).sort({ createdAt: -1 }).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

  // Edit Dealer
  editDealer: async (req, resp, next) => {

    console.log(req.files)
    //Validation
    const registerSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      contact: Joi.string().required(),
      ssn: Joi.string().pattern(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/).messages({ 'string.pattern.base': 'ssn must be in the format XXX-XX-XXXX' }),
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.number().required(),
      companyName: Joi.string().required(),
    }).unknown();



    // Validation Error Show
    const { error } = registerSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }


    const existingUser = await Dealer.findById(req.params.id);
    // Destroy old image             
    if (existingUser.image) { 
      console.log()
      cloudinary.uploader.destroy(existingUser.image) }
    if (existingUser.companyLogo) { cloudinary.uploader.destroy(existingUser.companyLogo) }

    //  Image validation
    if (req.files.image) {

      const image = await cloudinary.v2.uploader.upload(req.files['image'][0].path, { folder: "Gocaltity" });
      if (image) { req.body.image = image.public_id }
      // delete multer image
      await fs.remove(req.files['image'][0].path);
    }

    // Company lOGO
    if (req.files.compamyLogo) {
      const companyLogo = await cloudinary.v2.uploader.upload(req.files['companyLogo'][0].path, { folder: "Gocaltity" });
      if (companyLogo) { req.body.companyLogo = companyLogo.public_id }
      // delete multer image
      await fs.remove(req.files['companyLogo'][0].path);

    }

    // Update Data

    Dealer.findByIdAndUpdate(req.params.id, req.body, { runValidators: true },)
      .then((data) => { return next(new errorHandler('succesfully', 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });
  },
  // Detail Dealer
  DetailDealer: async (req, resp, next) => {

    try {
      const dealer = await Dealer.findById({ _id: req.params.id }).exec();
      const vehicle = await Vehicle.find({ dealer_id: req.params.id }).populate(['feature_id']).exec();

      const combinedData = {
        vehicles: vehicle,
        dealer: dealer,
      };

      return next(new errorHandler(combinedData, 200,));
    }
    catch (error) { return next(new errorHandler(error.message, 400)); }


  }



}
export default DataDealer