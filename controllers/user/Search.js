
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";
import Package from "../../models/package.js";



   const Search= async  (req,resp,next)=>{


    try{
      const pkg = await Package.find({});
      const pkgVehicleIds = pkg.map(item => item.vehicle_id);


      
      const Featured =  await Vehicle.find({featured: true, _id: { $nin: pkgVehicleIds }}).populate(['feature_id']).select('-dealer_id').exec();
      const Vehicles  = await Vehicle.find({featured: false, _id: { $nin: pkgVehicleIds }}).populate(['feature_id']).select('-dealer_id').exec();
   
      const combinedData = {
        Featured : Featured,
        Vehicles : Vehicles,
      };
      return next(new errorHandler(combinedData,200,));
     }
   
     catch(error){ return next(new errorHandler(error.message, 400));  }   

}

    
  




    export default Search