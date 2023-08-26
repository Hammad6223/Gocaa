import Dealer from "../../models/dealer.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import cart from "../../models/cart.js";
import Driver from "../../models/driver.js";
import Booking from "../../models/booking.js";

const DataResveration = {

  // View Resveration
  latestResveration: async (req, resp, next) => {

    await cart.find({status : 'pending'}).populate('user_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

    // Detail Resveration
    detailResveration: async (req, resp, next) => {

      const  resveration =   await cart.findById({_id: req.params.id }).populate({path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}).populate('service_id').populate('package_id').populate('user_id').exec();
      const driver =await Driver.find({}).exec();

          const combinedData = {
           resveration:  resveration,
           driver: driver,
          };
    
          return next(new errorHandler(combinedData, 200,));

      },



        // Detail Resveration
    cancelResveration: async (req, resp, next) => {

    
      await Booking.deleteMany({ cart_id: req.params.id});
      await cart.findByIdAndUpdate( { _id: req.params.id }, { booking_id: null, status: 'rejected' }).exec()
      .then(() => { return next(new errorHandler('Successfully', 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

 

      },


}
export default DataResveration