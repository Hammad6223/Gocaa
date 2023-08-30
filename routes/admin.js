import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import {DataProfile,DataVehicle, DataDealer, DataDriver, DataService, DataPackage,DataResveration,DataBooking} from '../controllers/admin/index.js';


// Profile Section
router.get('/profile' ,auth, authorizeRoles("admin"), DataProfile.viewProfile );
router.post('/edit_profile' ,auth, authorizeRoles("admin"), upload.single('image')  , DataProfile.editProfile);

//  End Profile Section


// Dealer Section
router.post('/add_dealer' , auth, authorizeRoles("admin"),  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'companyLogo', maxCount: 1 }  ]), DataDealer.addDealer);
router.get('/view_dealer' , auth, authorizeRoles("admin"), DataDealer.ViewDealer );
router.get('/detail_dealer/:id' , auth, authorizeRoles("admin"), DataDealer.DetailDealer );
router.post('/edit_dealer/:id' ,auth, authorizeRoles("admin"), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'companyLogo', maxCount: 1 }  ]), DataDealer.editDealer);
//  End Dealer Section


//  Vehicle Section
router.post('/add_vehicle' , auth, authorizeRoles("admin"),  upload.single('image') ,DataVehicle.addVehicle );
router.get('/view_vehicle' , auth, authorizeRoles("admin"), DataVehicle.viewVehicle );
router.get('/detail_vehicle/:id' , auth, authorizeRoles("admin"), DataVehicle.DetailVehicle );
router.get('/featured/:id' , auth, authorizeRoles("admin"), DataVehicle.featured );
router.get('/view_featured' , auth, authorizeRoles("admin"), DataVehicle.viewFeatured );

// car listong features
router.post('/add_feature' , auth, authorizeRoles("admin"), DataVehicle.addFeature );
router.get('/view_feature' , auth, authorizeRoles("admin"), DataVehicle.viewFeature );
// End Vehicle Section



// Driver Section
router.post('/add_driver' , auth, authorizeRoles("admin"),  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'licenseCopy', maxCount: 1 }  ]), DataDriver.addDriver);
router.get('/view_driver' , auth, authorizeRoles("admin"), DataDriver.ViewDriver );
router.get('/detail_driver/:id' , auth, authorizeRoles("admin"), DataDriver.DetailDriver );
router.post('/edit_driver/:id' ,auth, authorizeRoles("admin"), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'licenseCopy', maxCount: 1 }  ]), DataDriver.editDriver);
//  End Driver Section



// service  Section
router.post('/add_service' , auth, authorizeRoles("admin"),  upload.single('image') , DataService.addService);
router.get('/view_service' , auth, authorizeRoles("admin"), DataService.ViewService );
//  End service Section



// Package  Section
router.post('/add_package' , auth, authorizeRoles("admin"),  upload.single('image') , DataPackage.addPackage);
router.get('/view_package' , auth, authorizeRoles("admin"), DataPackage.viewPackage );
router.get('/detail_package/:id' , auth, authorizeRoles("admin"), DataPackage.detailPackage );
//  End Package Section


// Resveration  Section
router.get('/latest_resveration' , auth, authorizeRoles("admin"), DataResveration.latestResveration );
router.get('/detail_resveration/:id' , auth, authorizeRoles("admin"), DataResveration.detailResveration );

router.get('/cancel_resveration' , auth, authorizeRoles("admin"), DataResveration.canceltotalResveration );
router.get('/cancel_resveration/:id' , auth, authorizeRoles("admin"), DataResveration.cancelResveration );
router.get('/approve_resveration/:id' , auth, authorizeRoles("admin"), DataResveration.approveResveration );

router.get('/inprogress_resveration' , auth, authorizeRoles("admin"), DataResveration.inprogressResveration );
router.get('/detail_approve_resveration/:id' , auth, authorizeRoles("admin"), DataResveration.detailapproveResveration );

//  End Resveration Section

// Booking  Section
router.post('/booking/:id' , auth, authorizeRoles("admin"), DataBooking.booking );
router.post('/package_booking/:id' , auth, authorizeRoles("admin"), DataBooking.packageBooking );
router.get('/view_booking' , auth, authorizeRoles("admin"), DataBooking.viewBooking );
//  End Booking Section


export default router; 

