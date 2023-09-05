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
router.get('/home' ,auth, authorizeRoles("user"), Home );

// Search
router.get('/search' ,auth, authorizeRoles("user"), Search );

// Search
router.post('/cart' ,auth, authorizeRoles("user"),Reservation );

router.get('/inprogress_order' ,auth, authorizeRoles("user"),Order.inprogress );

router.get('/pending_order' ,auth, authorizeRoles("user"),Order.pending );
router.get('/cancel_order' ,auth, authorizeRoles("user"),Order.cancel );

router.get('/notification' ,auth, authorizeRoles("user"),Order.notification );


router.get('/check_notification' ,auth, authorizeRoles("user"),Order.notification );




router.get('/user_notification',auth, authorizeRoles("user"),NotificationData)

export default router;