import fs from 'fs-extra';
import QRCode from 'qrcode';
import cloudinary from '../../utills/cloudinaryConfig.js';
import cart from '../../models/cart.js';
import errorHandler from "../../utills/errorhandler.js";
async function QrCode(cart_id,vehicle_id,driver_id) {

  console.log(cart_id,vehicle_id,driver_id)
  try {
    // Fetch cart data by ID
 


    const data = {cart_id,vehicle_id,driver_id};

    // Options for QR code generation
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
    };

    // Generate QR code and save to a file
    const qrCodeImagePath = 'images/qrcode.png';
    QRCode.toFile(qrCodeImagePath, JSON.stringify(data), options);

    // Upload the QR code image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(qrCodeImagePath, {
      folder: 'Gocaltity',
    });

    if (result.public_id) {
      // Remove the local QR code image
      await fs.remove(qrCodeImagePath);
      return  result.public_id;
   
    } 
  } catch (error) {

console.log(error.message)
   
  }
}

export default QrCode;
