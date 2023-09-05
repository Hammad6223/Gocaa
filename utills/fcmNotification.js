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
export const fcmNotification = async () => {
    const message = {
        notification: {
          title: 'New Message',
          body: 'You have a new message!',
        },
        token: 'c8uQJjptS6yj2s1jvFfpWO:APA91bGmKbt5hjzCjjf-BPqcjnHBLgVXGRTyvUGYQ68SM1cxoRXNI4vDp51pXKRS5oYEkVkjQz0uOYbkBG9O7_hmPnJwlY9AS1LqQphxe4wPupKDHnLOXkJt811bAQ_bL3wODhncSKVq', // The device token of the recipient
      };
      
      // Send the message
      admin.messaging().send(message)
        .then((response) => {
          console.log('Notification sent:', response);
        })
        .catch((error) => {
          console.error('Error sending notification:', error);
        });
}
