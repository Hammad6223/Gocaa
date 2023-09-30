
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionSchema = new Schema({

  
    transactionId: { type: String, required: true},
    orderId: { type: mongoose.Schema.Types.ObjectId,  ref:'Cart' ,required:true},
    user_id:{ type: mongoose.Schema.Types.ObjectId,  ref:'User' },
   
}, {timestamps: true});



export default mongoose.model('Transaction' ,transactionSchema);