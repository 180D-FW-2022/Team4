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
  "private_key_id": /*insert private key id*/,
  "private_key": /*insert private key*/,
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
