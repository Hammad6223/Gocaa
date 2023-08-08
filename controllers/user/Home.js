
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";
import Service from '../../models/service.js'



   const Home= async  (req,resp,next)=>{


    try{
    
   const vehicle =  await Vehicle.find({featured: true}).populate(['feature_id']).exec();
   const service  = await Service.find({}).exec();

   const combinedData = {
    vehicles : vehicle ,
    services : service,
   };

   return next(new errorHandler(combinedData,200,));
  }

  catch(error){ return next(new errorHandler(error.message, 400));  }

      
  }


    export default Home