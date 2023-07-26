
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const ConnectDB = async () => {

mongoose.connect(process.env.DB_URL , {useNewUrlParser: true,useUnifiedTopology: true}) 
 .then(() => {
    console.log(`Mongodb connected with server`);
  })
  .catch((err) => {
    console.log("Mongodb connection error", err);
  });

}

export default ConnectDB;


  