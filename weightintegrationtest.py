import time
import pyrebase
import sys
from random import randint

config = {
  "apiKey": "AIzaSyDe6yvhZxc0z5cavL17xUlob3K8m4kZy1Y",
  "authDomain": "pill-smart.firebaseapp.com",
  "databaseURL": "https://pill-smart-default-rtdb.firebaseio.com",
  "storageBucket": "pill-smart.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()


#HX711
EMULATE_HX711=False

referenceUnit = 1

if not EMULATE_HX711:
    import RPi.GPIO as GPIO
    from hx711 import HX711
else:
    from emulated_hx711 import HX711

def cleanAndExit():
    print("Cleaning...")

    if not EMULATE_HX711:
        GPIO.cleanup()
        
    print("Bye!")
    sys.exit()

hx = HX711(5, 6)
hx.set_reading_format("MSB", "MSB")
hx.set_reference_unit(480)

hx.reset()

hx.tare()

print("Tare done! Add weight now...")

print("Send Data to Firebase Using Raspberry Pi")
print("—————————————-")
print()

while True:
  prev = 0
  count = 0
  while count < 10:
    val = max(0, int(hx.get_weight(5)))

    if prev == val:
        count += 1
    prev = val

  compartment1_weight = float(prev)

  print("Compartment 1 Weight: {} g".format(compartment1_weight))
  print()

  data = {
    "weight": compartment1_weight,
  }
  db.child("pill-data").child("compartment-1").update(data)


time.sleep(2)