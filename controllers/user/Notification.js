
import errorHandler from "../../utills/errorhandler.js";
import Notification from "../../models/notification.js";


   const NotificationData =  async  (req,resp,next)=>{

    
        Notification.find({ user_id:req.user._id}).sort({ createdAt: -1 })
        .then( (data) =>{ return next(new errorHandler(data, 200)); })
        .catch((error) =>{return next(new errorHandler("user not found", 400));  }); 
      

}

  
export default NotificationData
    
  


