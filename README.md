# Team4

This master branch contains the code for the weight sensor (unit and integration) and voice recognition modules. It also contains the code for IMUtest.py, the modified version of berryIMU.py. The design decisions for these modules can be found in Team 4's Final Report.

Pillsmart requires a Raspberry Pi Zero, two load cells, two HX711 weight sensors, a BERRYIMU V3 IMU, a solenoid, and some supporting circuitry for the solenoid(provided). To power Pillsmart, a portable charger is used. For voice recognition, a secondary Raspberry Pi Zero, a microphone, and a speaker can be utilized; however it can also be run with a smartphone and just a speaker. 

For communication with the online Firebase database, Pyrebase must be installed on the Raspberry Pi. Pyrebase is a python wrapper for the Firebase API. It can be installed with the command "pip install pyrebase" on the Raspberry Pi when first setting up Pillsmart.

final_integration.py contains the code for all subsystems relating to the box. Running this file allows for the full functionality of the box.

The voice recognition code was referenced from the Google Assistant API developer documentation [website](https://developers.google.com/assistant/sdk/guides/service/python/embed/setup?hardware=rpi). Please follow the instructions in the provided link to download, install, and setup Google Assistant on the Raspberry Pi. Please run the file pushtotalk.py using the command "python pushtotalk.py" to activate the voice assistant. The voice assistaant will constantly run and listen to commands provided by the user.

The voice recognition system is fully integrated will all remaining modules of the product and supports the following commands: 
"Open pillbox" 
"How many pills remaining in [compartment #]" 
"When is my next schedule for [compartment #]"

In addition to the Raspberry Pi, the voice assistant can be invoked through any Google Assistant client (smartphone, home speaker, etc.) as long as the client is logged into the same Google Account as the one used to authenticate Google Assistant and host Firestore services.

IMUtest.py includes the addition of the boolean variable levelFlag, which is only true if the IMU readings for CFAngleY is between -75 and -105. The boolean value of levelFlag is printed after each reading.

The weight sensor programs consist of weight.py and weightintegrationtest.py. weightintegrationtest2.py simultaneously reads data from 2 weight sensors and updates the realtime Firebase database with the weight sensor readings. weightintegrationtest2_1.py takes this functionality and prevents readings from being updated in Firebase if the box is not level.

To set up the web application software for PillSmart, Node Package Manager (npm) must be installed. Install [npm here](https://www.npmjs.com). Once npm is installed, please clone the repository locally, visit the pill-smart directory, and type the command "npm start". A new tab should open in your default browser window and an instance of the PillSmart user interface should appear! A globally hosted instance of the PillSmart website can be [found here](https://pill-smart.web.app/).
