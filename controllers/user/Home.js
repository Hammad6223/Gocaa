
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";
import Service from '../../models/service.js'
import Package from "../../models/package.js";
import cart from "../../models/cart.js";
import Joi from "joi";

const Home = {

  Home1: async (req, resp, next) => {

    try {
      const pkg = await Package.find({});
      const pkgVehicleIds = pkg.map(item => item.vehicle_id);

      const vehicle = await Vehicle.find({ featured: true , _id: { $nin: pkgVehicleIds } }).populate(['feature_id']).select('-dealer_id').exec();
      const service = await Service.find({}).exec();
      const package_detail = await Package.find({}).populate({ path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } }).populate('service_id').exec()

      const combinedData = {
        vehicles: vehicle,
        services: service,
        package: package_detail
      };

      return next(new errorHandler(combinedData, 200,));
    }

    catch (error) { return next(new errorHandler(error.message, 400)); }


  },


  Home2: async (req, resp, next) => {


    //Validation
    const CartSchema = Joi.object({

      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
    });
    console.log(req.body.endDate)

    // Validation Error Show
    const { error } = CartSchema.validate(req.body);
    if (error) { return next(new errorHandler(error.message, 400,)); }

    const cartUpdate = await cart.find({
      status:  {  $in :  "onBoarding" },
      $and: [
        { startDate: { $gte: req.body.startDate } },
        { endDate: { $lte: req.body.endDate } }
      ]
    });
    console.log('eee',cartUpdate)

    const pkg = await Package.find({});


    // Extract vehicle_id arrays from the cartUpdate and pkg results
    const cartVehicleIds = cartUpdate.map(item => item.vehicle_id);
    const pkgVehicleIds = pkg.map(item => item.vehicle_id);

    try {
      const Featured = await Vehicle.find({
        $nor: [{ _id: { $in: cartVehicleIds } }, { _id: { $in: pkgVehicleIds } }], featured: true
      }).select('-dealer_id').populate(['feature_id']).exec();

      const Vehicles = await Vehicle.find({
        $nor: [{ _id: { $in: cartVehicleIds } }, { _id: { $in: pkgVehicleIds } }], featured: false
      }).select('-dealer_id').populate(['feature_id']).exec();

      const combinedData = {
        Featured: Featured,
        Vehicles: Vehicles,
      };
      return next(new errorHandler(combinedData, 200,));
    }

    catch (error) { return next(new errorHandler(error.message, 400)); }


  }

}


export default Home