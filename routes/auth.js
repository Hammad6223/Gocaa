import express from 'express'
const router = express.Router();

import {LoginController,SignupController,ForgetController, DataReset} from '../controllers/auth/index.js';



// Login
router.post('/login' , LoginController );

// SignUp
router.post('/signup' , SignupController );
// Verify Otp
router.post('/signup_verify' , DataReset.SignupverifyOtp );

// Forget
router.post('/forget' , ForgetController );

// Verify Otp
router.post('/verify_otp' , DataReset.verifyOtp );

// set password
router.post('/set_password' , DataReset.setPassword );







export default router;