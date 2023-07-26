import express from 'express'
const router = express.Router();

import {LoginController,SignupController,ForgetController} from '../controllers/auth/index.js';



// Login
router.post('/login' , LoginController );

// SignUp
router.post('/signup' , SignupController );

// Forget
router.post('/forget' , ForgetController );




export default router;