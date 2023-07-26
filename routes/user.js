import express from 'express'
const router = express.Router();
import {auth,authorizeRoles} from '../middleware/auth.js';
import { upload } from '../utills/constant.js';

import {DataProfile} from '../controllers/user/index.js';

// Profile
router.get('/profile' ,auth, authorizeRoles("user"), DataProfile.viewProfile );

// Edit Profile
router.post('/edit_profile' ,auth, authorizeRoles("user"), DataProfile.editProfile );

// Edit Profile Image

router.post('/edit_profile_image' , auth, authorizeRoles("user"),  upload.single('image'), DataProfile.editProfileImage );



export default router;