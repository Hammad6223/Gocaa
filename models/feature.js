
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const featureSchema = new Schema({

    title: { type: String, required: true},

   
}, {timestamps: true});



export default mongoose.model('Feature' , featureSchema);