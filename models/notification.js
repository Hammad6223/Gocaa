
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema({

    title  : { type: String, required: true},
    body: { type: String, required: true},
    user_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'User' },
    cart_id: { type: mongoose.Schema.Types.ObjectId,  ref:'Cart' },

   
}, {timestamps: true});



export default mongoose.model('Notification' , notificationSchema);