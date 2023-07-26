
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const ConnectDB = async () => {

mongoose.connect('mongodb+srv://hammadakram6223:YDGtkYGVpNqXxPyW@gocality-db.zn233ki.mongodb.net/?retryWrites=true&w=majority'  ,{useNewUrlParser: true,useUnifiedTopology: true}) 
 .then(() => {
    console.log(`Mongodb connected with server`);
  })
  .catch((err) => {
    console.log("Mongodb connection error", err);
  });

}

export default ConnectDB;


  