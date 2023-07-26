
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({

    category: { type: String, required: true},
    registrationNumber: { type: String, required: true},
    color: { type: String, required: true},
    modal :{type:String,required: true},
    make :{type:String,required: true},
    variant :{type:String,required: true},
    price:{type:Number,required: true},
    engineCapacity:{type:Number,required: true},
    transmission:{type:String,required: true},
    image: { type: String,required: true},
    airConditioning: {type: Boolean, default: false },
    favourite: {type: Boolean },
    sunRoof: {type: Boolean },
    heatedSeats: {type: Boolean},
    navigationSystem: {type: Boolean},
    airBags: {type: Boolean},
    climateControl: {type: Boolean},  
    airConditioning: {type: Boolean },
    image: { type: String,required: true},
    dealer_id: { type: mongoose.Schema.Types.ObjectId,  ref:'Dealer',required: true },
   
}, {timestamps: true});



export default mongoose.model('Vehicle' , vehicleSchema);