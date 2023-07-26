class errorHandler extends Error {


  constructor(message, status){
      super(); // it calls extends class constuctor
      this.status = status;
    this.message = message;
  }

 
  static wrongCredentials(message = 'Username or Password is wrong!') {
    
    return new errorHandler( message,401);
  }

  static unAuthorized(message = 'unAuthorized Access') {
  return new errorHandler( message,401);
    }

}

export default errorHandler;
