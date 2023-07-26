import User from "../../models/user.js";
import errorHandler from "../../utills/errorhandler.js";
import nodemailer from 'nodemailer'
import Randomstring from "randomstring";
import { ForgetContent } from "../../utills/HtmlContent.js";

const ForgetController = async (req,resp,next)=>{

    const user = await User.findOne({ email: req.body.email });

    if (!user) { return next(errorHandler.wrongCredentials()) ;}
    // const randomstring = randomstring();
    // console.log()

    var transporter = nodemailer.createTransport({
      service: 'gmail',
        auth: {
          user: 'hammadakram6223@gmail.com',
          pass: 'mvjjeujpqbsisncl'
        }
      });
      
      var mailOptions = {
        from: "'Gocality' <hamamdakram6223@gmail.com>", 
        to: 'hadeedidrees65@gmail.com',
        subject: 'Gocality password change request',
        html:ForgetContent
      };
      
      transporter.sendMail(mailOptions, function(err, info){
        if(err){ return next(new errorHandler(err.message, 401)); }   
        else {   return next(new errorHandler( 'send code in your email', 200 )) }    }); 

    
    }




export default ForgetController;