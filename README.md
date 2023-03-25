# Team4

This master branch contains the code for the weight sensor (unit and integration) and voice recognition modules. It also contains the code for IMUtest.py, the modified version of berryIMU.py. The design decisions for these modules can be found in Team 4's Final Report.

Pillsmart requires a Raspberry Pi Zero, two load cells, two HX711 weight sensors, a BERRYIMU V3 IMU, a solenoid, and some supporting circuitry for the solenoid(provided). To power Pillsmart, a portable charger is used. For voice recognition, a secondary Raspberry Pi Zero, a microphone, and a speaker can be utilized; however it can also be run with a smartphone and just a speaker. 

For communication with the online Firebase database, Pyrebase must be installed on the Raspberry Pi. Pyrebase is a python wrapper for the Firebase API. It can be installed with the command "pip install pyrebase" on the Raspberry Pi when first setting up Pillsmart.

final_integration.py contains the code for all subsystems relating to the box. Running this file allows for the full functionality of the box.

The voice recognition code was referenced from the Google Assistant API developer documentation website. The individual instance is authenticated on Terry's Raspberry Pi. The program is altered to be integrated with the Firebase database that is used for our project's backend. 

IMUtest.py includes the addition of the boolean variable levelFlag, which is only true if the IMU readings for CFAngleY is between -75 and -105. The boolean value of levelFlag is printed after each reading.

The voice recognition system is fully integrated will all remaining modules of the product and supports the following commands: "Open pillbox", "How many pills remaining in [compartment #]", and "When is my next schedule for [compartment #]". 

The weight sensor programs consist of weight.py and weightintegrationtest.py. weightintegrationtest2.py simultaneously reads data from 2 weight sensors and updates the realtime Firebase database with the weight sensor readings. weightintegrationtest2_1.py takes this functionality and prevents readings from being updated in Firebase if the box is not level.

To set up the web application software for PillSmart, Node Package Manager (npm) must be installed. Install [npm here](https://www.npmjs.com). Once npm is isntalled, please clone the repository locally, visit the pill-smart directory, and type the command "npm start". A new tab should open in your default browser window and an instance of the PillSmart user interface should appear! A globally hosted instance of the PillSmart website can be [found here](https://pill-smart.web.app/).
