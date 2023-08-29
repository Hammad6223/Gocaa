import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import Order from '../controllers/user/Order.js';
import {DataProfile, Home,Search,Reservation} from '../controllers/user/index.js';

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

router.get('/order' ,auth, authorizeRoles("user"),Order );

router.get('/order' ,auth, authorizeRoles("user"),Order );



export default router;