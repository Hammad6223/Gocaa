import Dealer from "../../models/dealer.js";
import Vehicle from "../../models/vehicle.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import cloudinary from "../../utills/cloudinaryConfig.js";
import fs from "fs-extra";
import cart from "../../models/cart.js";

const DataResveration = {

  // View Dealer
  latestResveration: async (req, resp, next) => {

    await cart.find({}).populate({path : 'vehicle_id' ,populate: { path: 'feature_id',    model: 'Feature'}}).populate('service_id').populate('package_id').populate('user_id').exec()
      .then((data) => { return next(new errorHandler(data, 200)); })
      .catch((error) => { return next(new errorHandler("Something Went wrong", 400)); });

  },



}
export default DataResveration