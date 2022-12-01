import time
import pyrebase
from random import randint

config = {
  "apiKey": "AIzaSyDe6yvhZxc0z5cavL17xUlob3K8m4kZy1Y",
  "authDomain": "pill-smart.firebaseapp.com",
  "databaseURL": "https://pill-smart-default-rtdb.firebaseio.com",
  "storageBucket": "pill-smart.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

print("Send Data to Firebase Using Raspberry Pi")
print("—————————————-")
print()

while True:
  weight_1 = randint(0,10)
  weight_2 = randint(0,10)

  compartment1_weight = float(weight_1)
  compartment2_weight = float(weight_2)


  print("Compartment 1 Weight: {} °C".format(compartment1_weight))
  print("Compartment 2 Weight: {} °C".format(compartment2_weight))
  print()

  data = {
    "weight": compartment1_weight,
  }
  db.child("pill-data").child("compartment-1").update(data)

  data = {
    "weight": compartment2_weight,
  }
  db.child("pill-data").child("compartment-2").update(data)

time.sleep(2)