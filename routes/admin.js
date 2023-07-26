import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import {DataProfile,DataVehicle, DataDealer} from '../controllers/admin/index.js';


// Profile Section
router.get('/profile' ,auth, authorizeRoles("admin"), DataProfile.viewProfile );
router.post('/edit_profile' ,auth, authorizeRoles("admin"),DataProfile.editProfile);
router.post('/edit_profile_image' , auth, authorizeRoles("admin"),  upload.single('image'), DataProfile.editProfileImage );
//  End Profile Section


// Dealer Section
router.post('/add_dealer' , auth, authorizeRoles("admin"),  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'companyLogo', maxCount: 1 }  ]), DataDealer.addDealer);
router.get('/view_dealer' , auth, authorizeRoles("admin"), DataDealer.ViewDealer );
//  End Dealer Section


//  Vehicle Section
router.post('/add_vehicle' , auth, authorizeRoles("admin"),  upload.single('image') ,DataVehicle.addVehicle );
router.get('/view_vehicle' , auth, authorizeRoles("admin"), DataVehicle.viewVehicle );
router.post('/featured' , auth, authorizeRoles("admin"), DataVehicle.featured );
// End Vehicle Section




export default router; 

