
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const packageSchema = new Schema({

    title: { type: String, required: true},
    price:{type:Number,required: true},
    vehicleDiscount:{type:Number,required: true},
    serviceDiscount:{type:Number,required: true},
    image: { type: String,required: true},
    vehicle_id: [{ type: mongoose.Schema.Types.ObjectId,  ref:'Vehicle' }],
    service_id: [{ type: mongoose.Schema.Types.ObjectId,  ref:'Service' }],
}, {timestamps: true});



export default mongoose.model('Package' , packageSchema);