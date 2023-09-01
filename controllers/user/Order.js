
import errorHandler from "../../utills/errorhandler.js";
import Cart from "../../models/cart.js";
import Joi from "joi";
import Booking from "../../models/booking.js";

const Order = {

    inprogress :async  (req,resp,next)=>{
  

   Cart.find({status : 'inprogress',user_id :req.user._id}).select('-vehicle_id').populate('service_id')
   .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
   .populate( {path : 'booking_id', populate:{ path : 'driver_id' } }) 
   .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'} ,} }} )
   .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'driver_id' } }} )
   
   .exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 

 

},

 pending :async  (req,resp,next)=>{

    await Cart.find({status : 'pending' ,user_id :req.user._id}).populate({ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}).populate('service_id').populate( {path:'package_id',populate:{path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}}).exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

},

cancel :async  (req,resp,next)=>{

  await Cart.find({status : 'rejected' ,user_id :req.user._id}).populate({ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}).populate('service_id').populate( {path:'package_id',populate:{path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}}).exec()
    .then((data) => { return next(new errorHandler(data, 200)); })
    .catch((error) => { return next(new errorHandler(error.message, 400)); });

}

}
  

    
  




export default  Order;