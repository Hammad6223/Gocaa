import Package from "../../models/package.js";
import Vehicle from "../../models/vehicle.js";
import Service from "../../models/service.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import Feature from "../../models/feature.js";
import cart from "../../models/cart.js";
import packageBookingData from "../../models/packageBookingData.js";

const DataPackage = {

  addPackage: async (req, resp, next) => {


    // check image
    if (!req.file) { return next(new errorHandler(' image is required', 400)); }
    if (!req.body.vehicle_id) { return next(new errorHandler('please at least one vehicle add', 400)); }
    if (!req.body.service_id) { return next(new errorHandler('please at least one service add', 400)); }


    //Validation
    const PackageSchema = Joi.object({
      title: Joi.string().required(),
      vehicleDiscount: Joi.number().required(),
      serviceDiscount: Joi.number().required(),
    }).unknown();


    // Validation Error Show
    const { error } = PackageSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }

    //    Discount Calcualte
    const vehicles = await Vehicle.find(({ _id: { $in: req.body.vehicle_id } })).exec();
    const services = await Service.find(({ _id: { $in: req.body.service_id } })).exec();

    
    let vehicleSum = 0; let serviceSum = 0; let totalprice = 0;
    for (const vehicle of vehicles) { vehicleSum += vehicleSum + vehicle.price }
    for (const service of services) { serviceSum += serviceSum + service.price }

    let vehicleDis = vehicleSum - (vehicleSum * req.body.vehicleDiscount / 100)
    let serviceDis = serviceSum - (serviceSum * req.body.serviceDiscount / 100)
    totalprice = vehicleDis + serviceDis

    // end discount

    // Upload Cloudianry
    await cloudinary.v2.uploader.upload(req.file.path, { folder: "Gocaltity" }, async (error, result) => {

      if (error) { return next(new errorHandler(error, 400,)); }

      // delete multer image
      await fs.remove(req.file.path);
      // vehicle_id :JSON.parse(req.body.vehicle_id) , service_id :JSON.parse(req.body.service_id)
      await new Package({ ...req.body, image: result.public_id, price: totalprice, })
        .save().then(() => { return next(new errorHandler('Successfully', 200,)); })
        .catch((error) => { return next(new errorHandler(error.message, 400,)); })

    })
  },


  // View Package
  viewPackage: async (req, resp, next) => {



    Package.find({}).populate({ path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } }).populate('service_id').sort({ createdAt: -1 }).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });


  },



  // Detail Package
  detailPackage: async (req, resp, next) => {

    Package.findById({ _id: req.params.id }).populate({ path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } }).populate('service_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });


  },

  ShowPackageVehicle: async (req, resp, next) => {

    const cartUpdate = await cart.find({ status: { $ne: 'approved , rejected' } });
    const pkg = await Package.find({});


    // Extract vehicle_id arrays from the cartUpdate and pkg results
    const cartVehicleIds = cartUpdate.map(item => item.vehicle_id);
    const pkgVehicleIds = pkg.map(item => item.vehicle_id);


    await Vehicle.find({
      $nor: [{ _id: { $in: cartVehicleIds } }, { _id: { $in: pkgVehicleIds } }]
    }).populate('dealer_id')
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });


  },


}

export default DataPackage;