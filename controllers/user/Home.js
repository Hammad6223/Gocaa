
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";
import Service from '../../models/service.js'
import Package from "../../models/package.js";


   const Home= async  (req,resp,next)=>{


    try{
    
   const vehicle =  await Vehicle.find({featured: true}).populate(['feature_id']).exec();
   const service  = await Service.find({}).exec();
   const package_detail = await Package.find({}).populate({path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}).populate('service_id').exec()

   const combinedData = {
    vehicles : vehicle ,
    services : service,
    package :package_detail
   };

   return next(new errorHandler(combinedData,200,));
  }

  catch(error){ return next(new errorHandler(error.message, 400));  }

      
  }


    export default Home