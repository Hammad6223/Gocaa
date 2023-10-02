
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookingDataSchema = new Schema({

    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    vehicle_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Vehicle',required :true },
    driver_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Driver',required:true },
    cart_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Cart'},
    package_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'Package'},
    qrCodeImage: { type: String},
    
}, {timestamps: true});



export default mongoose.model('packageBookingData' ,BookingDataSchema);