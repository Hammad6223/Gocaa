import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import Feature from "../../models/feature.js";

const DataVehicle = {
  

  addVehicle: async (req, resp, next) => {

    console.log(req.files)

    if (!req.files || req.files.length === 0) { return next(new errorHandler('one image is required', 400)); }

    //Validation
    const VehicleSchema = Joi.object({
      title: Joi.string().required(),
      category: Joi.string().required(),
      registrationNumber: Joi.string().required(),
      color: Joi.string().required(),
      modal: Joi.string().required(),
      make: Joi.string().required(),
      variant: Joi.string().required(),
      price: Joi.number().required(),
      engineCapacity: Joi.number().required(),
      transmission: Joi.string().required(),
      favourite: Joi.boolean(),
      dealer_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),

    }).unknown();


    // Validation Error Show
    const { error } = VehicleSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }

    let paths = [];

    for (var i = 0; i < req.files.length; i++) {
    await cloudinary.v2.uploader.upload(req.files[i].path, { folder: "Gocaltity" }, async (error, result) => {


        if (error) { return next(new errorHandler(error, 400,)); }
        paths.push(result.public_id)
        await fs.remove(req.files[i].path);

      })
    }

    new Vehicle({ ...req.body, image: paths, feature_id: JSON.parse(req.body.feature_id) })
      .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
      .catch((error) => { return next(new errorHandler(error.message, 400,)); })


  },


  // View vehicle
  viewVehicle: async (req, resp, next) => {



    Vehicle.find({}).populate('dealer_id').populate(['feature_id']).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });


  },
  // DetailVehicle
  DetailVehicle: async (req, resp, next) => {

    await Vehicle.findById({ _id: req.params.id }).populate('feature_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },


  // Featured
  featured: async (req, resp, next) => {

    const vehicle = await Vehicle.findById({ _id: req.params.id });
    

    Vehicle.findByIdAndUpdate(req.params.id, { featured: !vehicle.featured },)
      .then(() => { return next(new errorHandler('Sucessfully', 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

  },

  // View Featured
  viewFeatured: async (req, resp, next) => {



    Vehicle.find({ featured: true }).populate('dealer_id').populate(['feature_id']).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });


  },



  // Features Section 


  addFeature: async (req, resp, next) => {


    //Validation
    const VehicleSchema = Joi.object({
      title: Joi.string().required(),

    });

    // Validation Error Show
    const { error } = VehicleSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }

    // Title unique check
    const user = await Feature.exists({ title: req.body.title })
    if (user) { return next(new errorHandler('Title already exists', 401)); }

    new Feature({ title: req.body.title })
      .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
      .catch((error) => { return next(new errorHandler(error.message, 400,)); })

  },



  // View Feature
  viewFeature: async (req, resp, next) => {
    Feature.find({}).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

}

export default DataVehicle;