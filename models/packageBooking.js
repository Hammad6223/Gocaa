
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const packageDataSchema = new Schema({


    package_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Package'},
    package_booking_data:[{ type: mongoose.Schema.Types.ObjectId,  ref:'packageBookingData' }],
    cart_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Cart'},

   
}, {timestamps: true});



export default mongoose.model('packageBooking' ,packageDataSchema);