
import multer from 'multer';


    //   Multer confiq
     export  const upload = multer({  
      storage : multer.diskStorage({

       destination: function (req, file, cb) {
           cb(null, 'images')
         },
         filename: function (req, file, cb) {

           cb(null, file.fieldname + '-' + Date.now() + '.png')

         }
         
   })
})

// Base Path of cloudinary 

export const cloudinaryPath = 'http://res.cloudinary.com/dx3oigwug/image/upload/v1690184676/'

