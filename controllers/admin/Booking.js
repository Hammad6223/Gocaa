import Booking from "../../models/booking.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import Cart from "../../models/cart.js";
import packageBooking from "../../models/packageBooking.js";

import packageBookingData from '../../models/packageBookingData.js'
import transaction from "../../models/transaction.js";
import QrCode from "./QrCode.js";
const DataBooking = {

  // View Resveration
   booking: async (req, resp, next) => {
    console.log(req.body)
    
    const res = await Cart.findById(req.params.id).exec();
    // console.log(res)


    // Car booking duplicate check
    const vehicle_Check = await Booking.find({
      vehicle_id: req.body.vehicle_id,  $and: [  { startDate: { $gte: res.startDate } },  { endDate: { $lte: res.endDate } }] });
     
if(vehicle_Check.length  ==1  ) {return next(new errorHandler('Vehicle Can not free', 400));  }
   
    const data = await Booking.find({
      driver_id: req.body.driver_id,  $and: [  { startDate: { $gte: res.startDate } },  { endDate: { $lte: res.endDate } }] });
     console.log('1111111111',data)

      const checkBookingData = await packageBookingData.find({
        driver_id: req.body.driver_id,
        $and: [
          { startDate: { $gte: res.startDate } },
          { endDate: { $lte: res.endDate } }
        ]
      });

      console.log('22222222222',checkBookingData)
    if(data.length === 0  && checkBookingData.length ===0) {
     const publicpath = await QrCode(req.params.id , req.body.vehicle_id,req.body.driver_id  )
    
    new Booking({ ...req.body,qrCodeImage :publicpath, cart_id:req.params.id,startDate:res.startDate ,endDate:res.endDate })
    .save().then( (data) =>{

      Cart.findByIdAndUpdate( req.params.id,   { $push: { booking_id: data._id } }, { runValidators: true }, )
      .then( () =>{ return next(new errorHandler('Successfully', 200)); })
      .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
     
    })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
  }
  else{
  {return next(new errorHandler('driver can not free', 400));  }
  }
    

    
  
    
  },

  packageBooking: async (req, resp, next) => {

    console.log(req.body)
       // Car booking duplicate check
       const cart = await Cart.findById(req.body.cart_id).exec();

       const vehicle_Check = await packageBookingData.find({
        vehicle_id: req.body.vehicle_id,  $and: [  { startDate: { $gte: cart.startDate } },  { endDate: { $lte: cart.endDate } }] });
       console.log(vehicle_Check)
  if(vehicle_Check.length  === 1 ) {return next(new errorHandler('Vehicle Can not free', 400));  }
  
    try {
      
    
      // Find bookings and package bookings that overlap with the cart's date range
      const bookingData = await Booking.find({
        driver_id: req.body.driver_id,
        $and: [
          { startDate: { $gte: new Date(cart.startDate) } },
          { endDate: { $lte: new Date(cart.endDate) } }
        ]
      });
    
      const checkBookingData = await packageBookingData.find({
        driver_id: req.body.driver_id,
        $and: [
          { startDate: { $gte: new Date(cart.startDate) } },
          { endDate: { $lte: new Date(cart.endDate) } }
        ]
      });
    
      if (bookingData.length === 0 && checkBookingData.length === 0) {
        // Create a new package booking
        const publicpath = await QrCode(req.body.cart_id , req.body.vehicle_id,req.body.driver_id  )
   console.log(publicpath)
            const newPackageBooking = new packageBookingData({
          vehicle_id: req.body.vehicle_id,
          startDate: cart.startDate,
          endDate: cart.endDate,
          driver_id: req.body.driver_id,
          cart_id:req.body.cart_id,
          package_id: req.params.id,
          qrCodeImage :publicpath
        });
    
        const data1 = await newPackageBooking.save();
        console.log('data1',data1)
    
        // Check if a package booking for the same package_id already exists
        const existingPackageBooking = await packageBooking.findOne({
          package_id: req.params.id,
          cart_id:req.body.cart_id,
        }).exec();
    
        let data2 = null;
    
        if (existingPackageBooking) {
          // Update the existing package booking
          existingPackageBooking.package_booking_data.push(data1._id);
          data2 = await existingPackageBooking.save();
        } else {
          // Create a new package booking if none exists for the package_id
          const newPackageBooking = new packageBooking({
            package_id: req.params.id,
            package_booking_data: [data1._id],
            cart_id:req.body.cart_id,
          });
          data2 = await newPackageBooking.save();
          await Cart.findByIdAndUpdate(req.body.cart_id, {$push: { package_booking_id: data2._id }}, { runValidators: true });
    
         
        }
        return next(new errorHandler('Successfully', 200));
        // Update the cart if necessary
        
      } else {
        return next(new errorHandler('Driver cannot be free', 400));
      }
    } catch (error) {
      console.log(error)
      return next(new errorHandler(error.message, 400));
    }
    
    
      

  
    
  },


  
  // View Booking
  viewBooking: async (req, resp, next) => {

    await Booking.find({}).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },

    // View Booking
    viewPackageBooking: async (req, resp, next) => {

      await packageBookingData.find({}).exec()
        .then((data) => { return next(new errorHandler(data, 200)); })
        .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });
    },


    transaction: async (req, resp, next) => {

      await transaction.find({}).populate('orderId').populate('user_id').exec()
        .then((data) => { return next(new errorHandler(data, 200)); })
        .catch((error) => { return next(new errorHandler(error.message, 400)); });
  
    },


}
export default DataBooking