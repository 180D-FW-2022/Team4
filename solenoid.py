#https://images.theengineeringprojects.com/image/main/2021/03/raspberry-pi-zero-5.png
#above link is the pinout for the Raspberry Pi Zero

# The solenoid script. This script will activate the solenoid for a second and turn it off after

from time import sleep
import RPi.GPIO as GPIO

# GPIO Pin where solenoid control circuit is connected.
solenoid_pin = 8

# Define the Pin numbering type and define Servo Pin as output pin.
#GPIO.BOARD makes the pin number correspond to the actual number on the pinout
GPIO.setmode(GPIO.BOARD)
GPIO.setup(solenoid_pin, GPIO.OUT)

# Activate the solenoid for a second.
GPIO.output(8, GPIO.HIGH)
sleep(5)
GPIO.output(8, GPIO.LOW)

GPIO.cleanup()

