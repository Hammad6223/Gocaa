


import admin from 'firebase-admin';
import fs from 'fs';



  fs.readFile('./fcmConfiq.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err);
      return;
    }
    const config = JSON.parse(jsonString);
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
    
    // Now you can use the Firebase Admin SDK
  });
export const fcmNotification = async (noti, tokens,data) => {

 console.log(data)
 const complexDataString = JSON.stringify(data);
  tokens.map((item,index)=>{


    const message = {
        notification: noti ,
        data : { id:complexDataString ,  screen:"OrderDetail"},
        
        token: item
      };
      
      // Send the message
      admin.messaging().send(message)
        .then((response) => {
        console.log('Notification sent:', response);
        })
        .catch((error) => {
        console.error('Error sending notification:', error);
        });


      })
}
