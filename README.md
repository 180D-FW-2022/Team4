# Team4

This master branch contains the code for the weight sensor (unit and integration) and voice recognition modules. It also contains the code for IMUtest.py, the modified version of berryIMU.py. The design decisions for these modules can be found in Team 4's Final Report.

The voice recognition code was referenced from the Google Assistant API developer documentation website. The individual instance is authenticated on Terry's Raspberry Pi. The program is altered to be integrated with the Firebase database that is used for our project's backend. 

IMUtest.py includes the addition of the boolean variable levelFlag, which is only true if the IMU readings for CFAngleY is between -75 and -105. The boolean value of levelFlag is printed after each reading.

The voice recognition system is fully integrated will all remaining modules of the product and supports the following commands: "Open pillbox", "How many pills remaining in [compartment #]", and "When is my next schedule for [compartment #]". 

The weight sensor programs consist of weight.py and weightintegrationtest.py. weight.py provides base functionality for the weight sensor, allowing readings from the weight sensor to be displayed on the computer's terminal window. weightintegrationtest.py includes this functionality and takes it a step further by updating the realtime Firebase database with the weight sensor readings. commtest.py was used in intermediary steps to ensure that we were able to connect to the realtime Firebase database and modify values in it through the Raspberry Pi.
