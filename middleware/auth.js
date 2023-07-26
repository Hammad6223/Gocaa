import  jwt  from 'jsonwebtoken';
import ErrorHandler from '../utills/errorhandler.js';


import { config } from 'dotenv';
config();

export const auth  = async (req, resp, next)=>{ 

  

    let token  = req.headers['auth'];
    // return resp.json(token)
    
    if (!token)  { next(ErrorHandler.unAuthorized()) }
   
    else{

    try{

    const {_id,role} =  jwt.verify(token , process.env.JWT_SECRET_KEY)

    // Get Data in token
    const user = {
      _id: _id,
      role:role
    }

    req.user = user;
    next()  
   }

   catch { next(ErrorHandler.unAuthorized()) }
  }
 }


 export const authorizeRoles = (role) => {
  return (req, res, next) => {

    if (req.user.role !== role) {
      next(ErrorHandler.unAuthorized())
    }
   
    next();
  };
};


  


   

