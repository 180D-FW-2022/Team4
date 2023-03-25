// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const firebaseAdmin = require('firebase-admin');

let dayMapping = {0: "Sunday",
                  1: "Monday",
                  2: "Tuesday",
                  3: "Wednesday",
                  4: "Thursday",
                  5: "Friday",
                  6: "Saturday"};

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
  {
  "type": "service_account",
  "project_id": "pill-smart",
  "private_key_id": "3f87d139ca7eb0b1f91a047ccc34b771cb24372e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChvyHEZ21NedYR\nNSvdyZzacVRhyfFonzVOk7lBrs4h0S7PtTI7KHoc5W0U3R70ddcbKdXMvpFlK7MI\nHCGRa5KU6cw/Ze0Q5xCWZlzCRi8ModFVdJEfSlsf9+1CVf5Bf+uCkvnb+bf6czXF\n+ZzyBNyjGNBl6TmJ/Dij9sMxB3vlSvdI2gkkRXhWa44fXQcrZbwi8IHYOpNGVGuO\nmakktx8fGQZVQ+V/vTEXATqNpkB4SBVccCMTFv+TfypraPBk2RUtr7KcQ7wIwUsB\nNsqwf6RDclfPRsNKqWgC2NFEnfpNqqpcApqErliN+FHuKV4qG+vpdxMKErwtAQXB\nii+BNt0tAgMBAAECggEAFZZ4AEm5meyX+KX7G9fr2m/jzkVwtgEB0WIACNc25eaQ\nc+KAOMsXOUIZw/4bQo9zzUlRIsmQiEtD0uJGTK1p2/w0aYXGFUpxuVEiMj/BydLT\nKK+tKtr2vJaPkRn/HGjhWwUY2hZDSucTlz/QhbDGbfJC5kcxicwjFyc5OBMCo0Ce\n3E+V4ITcSv8NyeyHNALSdLUpM0mK5HN9+8AI5LZ9uK+0v+qfOo9Z4cez2n1Uk8be\ntsp6nDb759+MrIMhIpNPpGZ3SDj+PjJ6fqly+aKcmdy814FkvQYuSeXUFmGcF3mc\nviN6S6e4dM5xpd1mt8DpHKgJ++/gkcSguwArRNgIlQKBgQDNpijP8DmQddjGNhmY\nmwdUrfZVgmZk4+dY5Epr1eKKNOJ6d3CmDXhnaGHFYG2Hsl76u5/HrnDV1WoHBQhh\nBT5yBmtezTW5TMW4mDws5UEudYDvYftJf5GBEwv/WtePR8ntmbLzKAyuTi03sFmr\n71sZSwL4jsa46XtA73QsEhG5lwKBgQDJWTf2ywOobiDomnAIBnYJ0NQv5IsJiYuG\n/sYplth9pG131FxrOYgtXL7Xxas+Bf4afeR7KDHpCXYkmRpbwTnupFKIAFUlQ5Xv\nnzZy+TwcpIye09cSs72TDgAYtFATt2vWff6/H3ZvJLHj4h2lnF7AmmGHgKgpB19q\nC3PdiGTP2wKBgQC8qEQkjoKgjhvxqkvM/du5yWWEiH4a7CCeIcBMMQkENQPXyZ7k\nFtNwOggHpDCXHgGYD2vDKbqF0KTWD73iE4d333+8lpFEjrOMZsw9e4tSbaV89ewr\nPwZi3PBSsCm0Xe1XNXs/KmyHs1w0DGoXGxv9lh0BnSmdFURnC8UNcP4lvQKBgAzL\ny7+2dTwOC69cqUQJTRUgnWuRxbhMcn6Y0HUyLf4GJiLYbystU9c2Lra9zD072kNK\nvuuIyWs6+7QlusQcCpd8//W+t6qPmgbJgodaCZT0bC9n3SJGJAUlfaIUS4aFQKg4\nB6mT0U4M8fU+mI2+21K4PPyEk6tP2aN+qNVqZqXDAoGANzl/UtLgHxMdRTmOL+rx\nYpCbPELuu/XWhKOrtIlw9D+BFelnCPY3fSZE7ts0U0f67bgO1XJaDV9zhajM4jNr\n/WT0x1Epuv/+nXXxQwE8H65Mz+PKzU0HET/rCrhZc8JD4r28wpJaLIOHA3cF7Mrk\nM9sHaQY80MJs+VDGcQEB0Hc=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ionga@pill-smart.iam.gserviceaccount.com",
  "client_id": "101729444649363531906",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ionga%40pill-smart.iam.gserviceaccount.com"
	}),
  databaseURL: 'ws://pill-smart-default-rtdb.firebaseio.com/',
});
const firestore_db = firebaseAdmin.firestore();
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to pillSmart!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  //function getPillsRemaining(agent) {
   //return firebaseAdmin.database().ref('pill-data').once("value").then((snapshot) => {
     //var num1 = snapshot.child('compartment-1').child('weight').val();
     //agent.add(`Weight of pills remaining in compartment 1 - ` + num1);
    //});
  //}
  
  function getPillsRemaining(agent) {
    var num = agent.parameters.number;
	return firestore_db.collection(`pills`).doc(num.toString()).get()
 		.then(doc => {
          agent.add(`Number of pills remaining in compartment ` + num.toString() +  ` is ` + doc.data().quantity.toString());
        });
  }
  
  //function getPillsRemaining2(agent) {
	//return firestore_db.collection(`pills`).doc(`2`).get()
 		//.then(doc => {
          //agent.add(`Number of pills remaining in compartment 2 ` + doc.data().quantity.toString());
        //});
  //}

  function schedule(agent) {
    var num = agent.parameters.number;
    return firestore_db.collection(`pills`).doc(num.toString()).get()
 		.then(doc => {
          var raw_date = doc.data().schedule.toString();
          const date = new Date();
          var day = dayMapping[date.getDay()];
          if (raw_date.includes(day) && !doc.data().consumed) {
            agent.add(`Please take your pill in compartment ` + num.toString() +  ` today.`);
          }
          else {
            for(let i = 1; i<7; i = i+1) {
              day = dayMapping[(date.getDay() + i) % 6];
              if(raw_date.includes(day)) {
                agent.add(`Please take your pill in compartment ` + num.toString() + ` on ` + day);
                break;
              }
              
            }
            
          }
      
        });
  }
  
  function openPillbox(agent) {
    return firebaseAdmin.database().ref('pillbox-status').once("value").then((snapshot) => {
      firebaseAdmin.database().ref('pillbox-status').set({
        'pillbox-status': 1,
      });
      	agent.add(`Opening pillbox.`);
      });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Pills Remaining', getPillsRemaining);
  //intentMap.set('Pills Remaining Two', getPillsRemaining2);
  intentMap.set('Schedule', schedule);
  intentMap.set('Open Pillbox', openPillbox);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
