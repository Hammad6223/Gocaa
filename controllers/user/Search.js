
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";




   const Search= async  (req,resp,next)=>{


    try{
    
      const Featured =  await Vehicle.find({featured: true}).populate(['feature_id']).exec();
      const Vehicles  = await Vehicle.find({featured: false}).populate(['feature_id']).exec();
   
      const combinedData = {
        Featured : Featured  ,
        Vehicles : Vehicles,
      };
   
      return next(new errorHandler(combinedData,200,));
     }
   
     catch(error){ return next(new errorHandler(error.message, 400));  }
   
         
     }

    
  




    export default Search