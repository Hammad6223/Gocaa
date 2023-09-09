import Dealer from "../../models/dealer.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import cart from "../../models/cart.js";
import Driver from "../../models/driver.js";
import Booking from "../../models/booking.js";
import packagebookingdata from '../../models/packageBookingData.js'
import { fcmNotification } from "../../utills/fcmNotification.js";
import User from "../../models/user.js";
import Notification from '../../models/notification.js'
import { ObjectId } from "mongodb";
const DataResveration = {

  // View Resveration
  latestResveration: async (req, resp, next) => {

    await cart.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('user_id')
      .select('-booking_id -vehicle_id -package_id -service_id -package_booking_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

  // Detail Resveration
  detailResveration: async (req, resp, next) => {

    const resveration = await cart.findById({ _id: req.params.id }).select('-booking_id -package_booking_id')
      .populate({ path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } }).populate('service_id')
      .populate('package_id').populate('user_id').exec();
    const driver = await Driver.find({}).exec();

    const combinedData = {
      resveration: resveration,
      driver: driver,
    };

    return next(new errorHandler(combinedData, 200,));

  },


  // Find cancel Resveration
  canceltotalResveration: async (req, resp, next) => {

    await cart.find({ status: 'rejected' }).populate('user_id').sort({ createdAt: -1 }).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

  },


  // Cancel Resveration
  cancelResveration: async (req, resp, next) => {


    await Booking.deleteMany({ cart_id: req.params.id });
    await cart.findByIdAndUpdate({ _id: req.params.id }, { booking_id: [], status: 'rejected' }).exec()
      .then(() => { return next(new errorHandler('Successfully', 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });



  },


  // Cancel Resveration
  approveResveration: async (req, resp, next) => {


    try {
      const cartUpdate = await cart.findByIdAndUpdate(req.params.id, { status: 'inprogress' });

      const user = await User.findById(cartUpdate.user_id);

      const objectId = new ObjectId(cartUpdate._id);
      // Convert the ObjectId back to a string
      const objectIdHexString = objectId.toHexString();


      // Extract the last 4 characters (digits)
      const last4Digits = objectIdHexString.slice(-4);

      const noti = { title: 'Order Inprogress', body: `your order ID  ${last4Digits} is in-progress complete your payment` }
      const data = objectId




      new Notification({ ...noti, user_id: user._id, cart_id: cartUpdate._id }).save();



      fcmNotification(noti, user.fcmTokens, data)

      // // Call your fcmNotification function here if needed

      return next(new errorHandler("Successfully", 200));
    } catch (error) {
      return next(new errorHandler("Something went wrong", 500));
    }

  },

  //  inprogress 
  inprogressResveration: async (req, resp, next) => {

    await cart.find({ status: 'inprogress' }).sort({ createdAt: -1 }).populate('user_id')
      .select('-booking_id -vehicle_id -package_id -service_id -package_booking_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

  },

      //  Onboarding
      onBoardingResveration: async (req, resp, next) => {

      await cart.find({ status: 'onBoarding' }).sort({ createdAt: -1 }).populate('user_id')
        .select('-booking_id -vehicle_id -package_id -service_id -package_booking_id').exec()
        .then((data) => { return next(new errorHandler(data, 200)); })
        .catch((error) => { return next(new errorHandler(error.message, 400)); });
    },


  // Detail approve Resveration
  detailapproveResveration: async (req, resp, next) => {
    console.log('ss')

    cart.findById({ _id: req.params.id }).select('-vehicle_id -package_booking_id').populate('service_id').populate('user_id').populate('package_id')
      .populate({ path: 'booking_id', populate: { path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } } })
      .populate({ path: 'booking_id', populate: { path: 'driver_id' } })

      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });


  },

  detailapprovePackageResveration: async (req, resp, next) => {

    const idsParam = req.params.id;

    // Split the parameter string using the hyphen as the delimiter
    const idsArray = idsParam.split('-');

    // Now you have an array with two IDs
    const id1 = idsArray[0];
    const id2 = idsArray[1];

    packagebookingdata.find({ $or: [{ package_id: id2 }, { card_id: id1 }] })
      .populate({ path: 'vehicle_id', populate: { path: 'feature_id', model: 'Feature' } })
      .populate('driver_id')
      .then((data) => {
        console.log(data)
        return next(new errorHandler(data, 200));
      })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

  },


}
export default DataResveration