
import multer from 'multer';


    //   Multer confiq
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'images'); // Set the destination directory for uploaded files
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png'); // Generate a unique filename for each uploaded file
      }
    });
    
   export const upload = multer({ storage: storage });

// Base Path of cloudinary 

export const cloudinaryPath = 'http://res.cloudinary.com/dx3oigwug/image/upload/v1690184676/'

