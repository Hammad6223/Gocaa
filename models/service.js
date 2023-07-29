
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const serviceSchema = new Schema({

    title: { type: String, required: true},
    price: { type: Number, required: true},
    image: { type: String,required: true},

   
}, {timestamps: true});



export default mongoose.model('Service' , serviceSchema);