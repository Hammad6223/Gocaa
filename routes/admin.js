import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import {DataProfile,DataVehicle, DataDealer, DataDriver, DataService, DataPackage,} from '../controllers/admin/index.js';


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
// car listong features
router.post('/add_feature' , auth, authorizeRoles("admin"), DataVehicle.addFeature );
router.get('/view_feature' , auth, authorizeRoles("admin"), DataVehicle.viewFeature );
// End Vehicle Section



// Driver Section
router.post('/add_driver' , auth, authorizeRoles("admin"),  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'licenseCopy', maxCount: 1 }  ]), DataDriver.addDriver);
router.get('/view_driver' , auth, authorizeRoles("admin"), DataDriver.ViewDriver );
//  End Driver Section



// service  Section
router.post('/add_service' , auth, authorizeRoles("admin"),  upload.single('image') , DataService.addService);
router.get('/view_service' , auth, authorizeRoles("admin"), DataService.ViewService );
//  End service Section



// Package  Section
router.post('/add_package' , auth, authorizeRoles("admin"),  upload.single('image') , DataPackage.addPackage);
router.get('/view_package' , auth, authorizeRoles("admin"), DataPackage.viewPackage );
//  End Package Section



export default router; 

