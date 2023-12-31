
import errorHandler from "../../utills/errorhandler.js";
import Cart from "../../models/cart.js";
import Joi from "joi";
import Booking from "../../models/booking.js";
import { fcmNotification } from "../../utills/fcmNotification.js";

const Order = {

    inprogress :async  (req,resp,next)=>{
  

   Cart.find({status : 'inprogress',user_id :req.user._id}).sort({ createdAt: -1 }).select('-vehicle_id -package_id -user_id').populate('service_id')
   .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
   .populate( {path : 'booking_id', populate:{ path : 'driver_id' } }) 
   .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'} ,} }} )
   .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'driver_id' } }} )
   .populate( {path : 'package_booking_id',populate:{ path : 'package_id' ,populate: { path: 'service_id', }  , select: '-vehicle_id' }  } )
   .exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
},

onboarding :async  (req,resp,next)=>{
  

  Cart.find({status : 'onBoarding',user_id :req.user._id}).sort({ createdAt: -1 }).select('-vehicle_id -package_id -user_id').populate('service_id')
  .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
  .populate( {path : 'booking_id', populate:{ path : 'driver_id' } }) 
  .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'} ,} }} )
  .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'driver_id' } }} )
  .populate( {path : 'package_booking_id',populate:{ path : 'package_id' ,populate: { path: 'service_id', }  , select: '-vehicle_id' }  } )
  .exec()
   .then( (data) =>{ return next(new errorHandler(data, 200)); })
   .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
},


orderpayment :async  (req,resp,next)=>{
  console.log(req.body)

  Cart.find({_id:req.body.cart_id}).select('-vehicle_id -package_id -user_id').sort({ createdAt: -1 }).populate('service_id')
  .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
  .populate( {path : 'booking_id', populate:{ path : 'driver_id' } }) 
  .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'} ,} }} )
  .populate( {path : 'package_booking_id', populate:{path : 'package_booking_data',populate:{ path : 'driver_id' } }} )
  .populate( {path : 'package_booking_id',populate:{ path : 'package_id' ,populate: { path: 'service_id', }  , select: '-vehicle_id' }  } )
  .exec()
   .then( (data) =>{ return next(new errorHandler(data, 200)); })
   .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 
},



 pending :async  (req,resp,next)=>{

    await Cart.find({status : 'pending' ,user_id :req.user._id}).sort({ createdAt: -1 }).populate({ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}).populate('service_id')
    .populate( {path:'package_id',populate:{path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}})
    .populate( {path:'package_id',populate:{path : 'service_id' }})
    .exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler(error.message, 400)); });

},

cancel :async  (req,resp,next)=>{

  await Cart.find({status : 'rejected' ,user_id :req.user._id}).sort({ createdAt: -1 }).populate({ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}).populate('service_id').populate( {path:'package_id',populate:{path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}}).exec()
    .then((data) => { return next(new errorHandler(data, 200)); })
    .catch((error) => { return next(new errorHandler(error.message, 400)); });

},



notification :async  (req,resp,next)=>{

fcmNotification();
}

}
  

    
  




export default  Order;