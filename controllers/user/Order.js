
import errorHandler from "../../utills/errorhandler.js";
import Cart from "../../models/cart.js";
import Joi from "joi";
import Booking from "../../models/booking.js";


   const Order =  async  (req,resp,next)=>{


   Cart.find({user_id :req.user._id}).select('-vehicle_id').populate('service_id').populate('user_id').populate('package_id')
   .populate( {path : 'booking_id', populate:{ path : 'vehicle_id' ,populate: { path: 'feature_id',  model: 'Feature'}}} )
   .populate( {path : 'booking_id', populate:{ path : 'driver_id' } })
   .populate( {path : 'booking_id', populate:{ path : 'package_id' } })  .exec()
    .then( (data) =>{ return next(new errorHandler(data, 200)); })
    .catch((error) =>{return next(new errorHandler(error.message, 400));  }); 

 

}

  

    
  




export default  Order;