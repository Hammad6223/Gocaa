import User from "../../models/user.js";
import Joi from "joi";
import errorHandler from "../../utills/errorhandler.js";
import bcrypt from 'bcryptjs'
import { otpGen } from "otp-gen-agent";
import { config } from 'dotenv';
import nodemailer from 'nodemailer'

 const SignupController = async (req,resp,next)=>{


      //Validation
    const registerSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName:  Joi.string().required(),
      email:     Joi.string().email().required(),
      password:  Joi.string().min(3).max(8).required(),
      confirm_password: Joi.string().valid(Joi.ref('password')).error( err => { err[0].message= "Confirm Password must match the password"; return err; } )
    });


    // Validation Error Show
    const { error } = registerSchema.validate(req.body);
    if(error){   return next(new errorHandler(error.message,400,));  }

    // Email unique check
    const user = await User.exists({email: req.body.email})
    if(user) { return next(new errorHandler('User email already exist',401)); }


    // Get Body Data
    const {firstName,lastName,email,password} = req.body;

    //  Password Bcrypt
    const HashedPassword =  await bcrypt.hash(password,12);

    const otp = await otpGen();
  const  otpExpiration = new Date(Date.now() + 10 * 60 * 1000); 
   
     try{
      const user =  new User({
      firstName,
      lastName,
      email,
      password :HashedPassword,
      otp: otp,
      otpExpiration : otpExpiration
    })
    await user.save(); 
    var transporter = nodemailer.createTransport({
      service: 'gmail',
        auth: {
          user:process.env.EMAIL,
          pass: process.env.PASS
        }
      });
      
      var mailOptions = {
        from: `'Gocality' <${process.env.EMAIL}>`, 
        to:    email ,
        subject: 'Gocality email verification',
        html:    `<!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <!--    <tr>
                                <td style="text-align:center;">
                                  <a href="http://localhost:5000/images/Logo.png" title="logo" target="_blank">
                                    <img width="60" src="http://localhost:5000/images/Logo.png" title="logo" alt="logo">
                                  </a>
                                </td>
                            </tr> -->
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                 We cannot simply send you your old password. 
                                                 A unique OTP to reset your password has been generated for you.
                                                 It will expire in 10 minutes. To reset your password use the otp code given below.
                                                </p>
                                               
                                                <a href="javascript:void(0);"
                                                    style="background:#8C7040;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:20px;">
                                                ${otp} </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <!--     <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                                </td>
                            </tr> -->
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>`
      };
      
      transporter.sendMail(mailOptions, function(err, info){
        if(err){ return next(new errorHandler(err.message, 401)); }   
        else {   return next(new errorHandler( 'Opt send in your email', 200 )) }    }); 

  
  
  }
    catch (error)  {return next(new errorHandler(error.message,500,)); } 
     
 
   }

     
export default SignupController