
import errorHandler from "../../utills/errorhandler.js";
import Vehicle from "../../models/vehicle.js";




   const Search= async  (req,resp,next)=>{
    
   await Vehicle.find({}).sort({ featured: -1 }).exec() 
   .then( (data) =>{ return next(new errorHandler(data, 200)); })
   .catch((error) =>{return next(new errorHandler("user not found", 400));  }); 
  

  }


    export default Search