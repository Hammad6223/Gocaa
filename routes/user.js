import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import Order from '../controllers/user/Order.js';
import {DataProfile, Home,Search,Reservation,NotificationData} from '../controllers/user/index.js';

// Profile
router.get('/profile' ,auth, authorizeRoles("user"), DataProfile.viewProfile );
router.post('/edit_profile' ,auth, authorizeRoles("user"), DataProfile.editProfile );
router.post('/edit_profile_image' , auth, authorizeRoles("user"),  upload.single('image'), DataProfile.editProfileImage );
//  End Profile Section


// Home
router.get('/home' ,auth, authorizeRoles("user"), Home.Home1 );
router.post('/home2' ,auth, authorizeRoles("user"),Home.Home2 );

// Search
router.get('/search' ,auth, authorizeRoles("user"), Search );

// Search
router.post('/cart' ,auth, authorizeRoles("user"),Reservation );

router.get('/inprogress_order' ,auth, authorizeRoles("user"),Order.inprogress );
router.get('/onboarding_order' ,auth, authorizeRoles("user"),Order.onboarding );

router.get('/pending_order' ,auth, authorizeRoles("user"),Order.pending );
router.get('/cancel_order' ,auth, authorizeRoles("user"),Order.cancel );
router.post('/order_payment' ,auth, authorizeRoles("user"),Order.orderpayment );


// router.post('/payment-sheet' ,auth, authorizeRoles("user"),Payment );


router.get('/check_notification' ,auth, authorizeRoles("user"),Order.notification );




router.get('/user_notification',auth, authorizeRoles("user"),NotificationData)

export default router;