import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import {DataProfile, Home,Search} from '../controllers/user/index.js';

// Profile
router.get('/profile' ,auth, authorizeRoles("user"), DataProfile.viewProfile );
router.post('/edit_profile' ,auth, authorizeRoles("user"), DataProfile.editProfile );
router.post('/edit_profile_image' , auth, authorizeRoles("user"),  upload.single('image'), DataProfile.editProfileImage );
//  End Profile Section


// Home
router.get('/home' ,auth, authorizeRoles("user"), Home );

// Search
router.get('/search' ,auth, authorizeRoles("user"), Search );



export default router;