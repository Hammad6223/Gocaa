
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    contact :{type:String},
    role :{ type:String ,enum :['user','admin'],default:'user'},
    gender :{type:String},
    dateOfBirth :{type:String},
    ssn :{type:String},
    bloodGroup:{type:String},
    street :{type:String},
    city:{type:String},
    state:{type:String},
    country:{type:String},
    zip:{type:Number},
    image: {type: String},  
    otp: String,
    otpExpiration: Date,
   
}, {timestamps: true});



export default mongoose.model('User' , userSchema);