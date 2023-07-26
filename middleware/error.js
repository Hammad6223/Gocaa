const  ErrorMiddleware  = async (err, req, resp, next) => {

  
  //  500 Internal Server Error
  err.status = err.status || 500;
  err.message = err.message || "Internal Server Error";



  if(err.status === 200 ) {  resp.status(err.status).json({ success: err.message,});   }

  else{  resp.status(err.status).json({error: err.message });  }


};

export default ErrorMiddleware 