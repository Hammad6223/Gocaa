
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema({

    totalPrice: { type: Number, required: true},
    startDate: { type: String, required: true},
    endDate: { type: String, required: true},
    startTime: { type: String, required: true},
    endTime: { type: String, required: true},
    reason : { type: String, required: true},
    location :{type:String,required: true},
    status: { type: String, enum: ['pending', 'approved', 'rejected','inprogress'],  default: 'pending', },
    vehicle_id:[{ type: mongoose.Schema.Types.ObjectId,  ref:'Vehicle' }],
    service_id: [{ type: mongoose.Schema.Types.ObjectId,  ref:'Service' }],
    package_id: [{ type: mongoose.Schema.Types.ObjectId,  ref:'Package' }],
    user_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'User' },
    booking_id:[{ type: mongoose.Schema.Types.ObjectId,  ref:'Booking' }],


   
}, {timestamps: true});



export default mongoose.model('Cart' ,cartSchema);