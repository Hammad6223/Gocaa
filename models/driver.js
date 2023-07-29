
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const driverSchema = new Schema({

    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true},
    contact :{type:String,required: true},
    ssn :{type:String,required: true},
    street :{type:String,required: true},
    city:{type:String,required: true},
    state:{type:String,required: true},
    country:{type:String,required: true},
    zip:{type:Number,required: true},
    image: { type: String,required: true},
    licenseCopy: { type: String},
    perHour:{type:Number,required: true},
   
}, {timestamps: true});



export default mongoose.model('Driver' , driverSchema);