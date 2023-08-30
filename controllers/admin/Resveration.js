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

    await cart.find({status : 'pending'}).sort({createdAt: -1}).populate('user_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

    // Detail Resveration
    detailResveration: async (req, resp, next) => {

      const  resveration =   await cart.findById({_id: req.params.id }).select('-booking_id')
      .populate({path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}).populate('service_id')
      .populate('package_id').populate('user_id').exec();
      const driver =await Driver.find({}).exec();

          const combinedData = {
           resveration:  resveration,
           driver: driver,
          };
    
          return next(new errorHandler(combinedData, 200,));

      },


 // Find cancel Resveration
 canceltotalResveration: async (req, resp, next) => {

  await cart.find({status : 'rejected'}).populate('user_id').sort({createdAt: -1}).exec()
    .then((data) => { return next(new errorHandler(data, 200)); })
    .catch((error) => { return next(new errorHandler(error.message, 400)); });

},


        // Cancel Resveration
      cancelResveration: async (req, resp, next) => {

    
      await Booking.deleteMany({ cart_id: req.params.id});
      await cart.findByIdAndUpdate( { _id: req.params.id }, { booking_id: [], status: 'rejected' }).exec()
      .then(() => { return next(new errorHandler('Successfully', 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

 

      },

      
        // Cancel Resveration
        approveResveration: async (req, resp, next) => {

    
          await cart.findByIdAndUpdate( { _id: req.params.id }, { status: 'inprogress' })
          .then((data) => { return next(new errorHandler('Successfully', 200)); })
          .catch((error) => { return next(new errorHandler(error.message, 400)); });
    
     
    
          },

  //  inprogress 
      inprogressResveration: async (req, resp, next) => {

        await cart.find({status : 'inprogress'}).sort({createdAt: -1}).populate('user_id').exec()
          .then((data) => { return next(new errorHandler(data, 200)); })
          .catch((error) => { return next(new errorHandler(error.message, 400)); });
      
      },


         // Detail approve Resveration
    detailapproveResveration: async (req, resp, next) => {

      cart.findById({_id: req.params.id}).select('-vehicle_id').populate('service_id').populate('user_id').populate('package_id')
      .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
      .populate( {path : 'booking_id', populate:{ path : 'driver_id' } })
      .populate( {path : 'booking_id', populate:{ path : 'package_id' } })  .exec()
       .then( (data) =>{ return next(new errorHandler(data, 200)); })
       .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 

     
      },


}
export default DataResveration