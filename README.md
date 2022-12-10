# Team4

This branch contains the code for the weight sensor (unit and integration) and voice recognition modules. It also contains the code for IMUtest.py, the modified version of berryIMU.py. The design decisions for these modules can be found in Team 4's Final Report.

The voice recognition code was referenced from the Google Assistant API developer documentation website. The individual instance is authenticated on Terry's Raspberry Pi. The program is altered to be integrated with the Firebase database that is used for our project's backend. 

IMUtest.py includes the addition of the boolean variable levelFlag, which is only true if the IMU readings for CFAngleY is between -75 and -105. The boolean value of levelFlag is printed after each reading.

At the time of writing (end of Fall Quarter), the program is able to accurately transcibe user commands and display the transcription on the console of the Raspberry Pi (all of this is acheived wirelessly through a WiFi connection). In the upcoming quarter, we will be fully integrating the Voice Recognition module with the backend and remaining modules of the pillbox. Enhancements will include custom commands and wake-keywords that the user can use to interact with the pillbox.
