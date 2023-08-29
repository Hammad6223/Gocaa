import Booking from "../../models/booking.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import Cart from "../../models/cart.js";


const DataBooking = {

  // View Resveration
   booking: async (req, resp, next) => {
    console.log(req.body)
    
    const res = await Cart.findById(req.params.id).exec();

   
    const data = await Booking.find({
      driver_id: req.body.driver_id,  $or: [  { startDate: { $gte: new Date(res.startDate) } },  { endDate: { $lte: new Date(res.endDate) } }] });
    
    if(data.length === 0) {
    new Booking({ ...req.body, cart_id:req.params.id,startDate:res.startDate ,endDate:res.endDate })
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
    const res = await Cart.findById(req.body.cart_id).exec();

    const data = await Booking.find({
      driver_id: req.body.driver_id,  $or: [  { startDate: { $gte: new Date(res.startDate) } },  { endDate: { $lte: new Date(res.endDate) } }] });
    
    if(data.length === 0) {
    new Booking({ ...req.body,startDate:res.startDate ,endDate:res.endDate,package_id:req.params.id })
    .save().then( (data) =>{
    
      Cart.findByIdAndUpdate( req.body.cart_id,   { $push: { booking_id: data._id } }, { runValidators: true }, )
      .then( () =>{ return next(new errorHandler('Successfully', 200)); })
      .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
     
    })
    .catch((error) =>  {return next(new errorHandler(error.message,400,)); })  
  }
  else{
    {return next(new errorHandler('driver can not free', 400));  }
  }
    

    
  
    
  },


  
  // View Booking
  viewBooking: async (req, resp, next) => {

    await Booking.find({}).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },



}
export default DataBooking