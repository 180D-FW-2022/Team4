import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("pill-smart-firebase-adminsdk-ionga-9d21ca2cbd.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()

doc_ref = db.collection(u'test').document(u'abc')
doc_ref.set({
        u'first': u"Ada",
        u'last': u'Lovelace',
        u'born': 1815
})
