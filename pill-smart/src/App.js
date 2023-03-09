import { db } from "./firebase"
import { useState, useEffect } from "react"
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc
} from "firebase/firestore"

function App() {
  const [pills, setPills] = useState([])
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    unit: 0,
    schedule: "",
    emails: [],
    compartment: 0,
    consumed: false
  })
  const [popupActive, setPopupActive] = useState(false)
  const [pillConsumed1, setFlag1] = useState(0)
  const [pillConsumed2, setFlag2] = useState(0)

  const pillsCollectionRef = collection(db, "pills")
  const mailCollectionRef = collection(db, "mail")

  useEffect(() => {
    onSnapshot(pillsCollectionRef, snapshot => {
      setPills(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          viewing: false,
          ...doc.data()
        }
      }))
    })

    setInterval(sendEmail, 60000, "ece180dagroup4@gmail.com")
    setInterval(pillConsumed, 60000)
  }, [])

  const handleView = id => {
    const pillsClone = [...pills]
    
    pillsClone.forEach(pill => {
      if (pill.id === id) {
        pill.viewing = !pill.viewing
      } else {
        pill.viewing = false
      }
    })

    setPills(pillsClone)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.name || !form.quantity || !form.unit || !form.schedule || !form.compartment) {
      alert("Please fill out all required fields")
      return
    }

    setDoc(doc(db, "pills", form.compartment), form)

    setForm({
        name: "",
        quantity: 0,
        unit: 0,
        schedule: "",
        emails: [],
        compartment: 0,
        consumed: false
    })

    setPopupActive(false)
  }

  const handleEmail = (e, i) => {
    const emailsClone = [...form.emails]

    emailsClone[i] = e.target.value

    setForm({
      ...form,
      emails: emailsClone
    })
  }

  const handleEmailCount = () => {
    setForm({
      ...form,
      emails: [...form.emails, ""]
    })
  }

  const removePill = id => {
    deleteDoc(doc(db, "pills", id))
  }

  async function sendEmail(email, subject = "PillSmart Alert", text = "", html = "") {
    //if it's the beginning of a new day, change the flag in the database to 0
    //if it's the eighth hour, send an email with all the pills that need to be taken today
    //if it's the twelfth hour, send a follow-up email with all the pills they still need to take
    const date = new Date();
    
    if (!email) {
      console.error("No email was provided");
    } else {
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        await updateDoc(doc(db, "pills", "1"), {consumed: false})
        await updateDoc(doc(db, "pills", "2"), {consumed: false})
      } else if (date.getHours() === 8 && date.getMinutes() === 0) {
        let consumed1 = await getDoc(doc(db, "pills", "1"))
        consumed1 = consumed1.data()["consumed"];
        
        let consumed2 = await getDoc(doc(db, "pills", "2"))
        consumed2 = consumed1.data()["consumed"];

        if (!consumed1 && consumed2) {
          text = "Please consume a pill in Compartment 1"
        } else if (consumed1 && !consumed2) {
          text = "Please consume a pill in Compartment 2"
        } else if (!consumed1 && !consumed2) {
          text = "Please consume a pill in Compartment 1 and Compartment 2"
        }
        
        if (!consumed1 || !consumed2) {
          addDoc(mailCollectionRef, {
            "to": [email],
            "message": {
              subject: subject,
              text: text,
              html: html
            }
          })
        }

      } else if (date.getHours() === 17 && date.getMinutes() === 43) {
        let consumed1 = await getDoc(doc(db, "pills", "1"));
        let emails = consumed1.data()["emails"];
        consumed1 = consumed1.data()["consumed"];
        
        let consumed2 = await getDoc(doc(db, "pills", "2"))
        //emails = emails.concat(consumed2.data()["emails"])
        consumed2 = consumed2.data()["consumed"];

        if (!consumed1 && consumed2) {
          text = "REMINDER: Please consume a pill in Compartment 1"
        } else if (consumed1 && !consumed2) {
          text = "REMINDER: Please consume a pill in Compartment 2"
        } else if (!consumed1 && !consumed2) {
          text = "REMINDER: Please consume a pill in Compartment 1 and Compartment 2"
        }
        
        if (!consumed1 || !consumed2) {
          addDoc(mailCollectionRef, {
            "to": [email],
            "message": {
              subject: "REMINDER: " + subject,
              text: text,
              html: html
            }
          })

          for(let i = 0; i < emails.length; i++) {
            addDoc(mailCollectionRef, {
              "to": [emails[i]],
              "message": {
                subject: subject,
                text: "Your loved one or patient has not taken their pill, please remind them to do so today.",
                html: html
              }
            })
          }
        }
      }
    }
  }

  async function pillConsumed() {
    let compartment1 = await getDoc(doc(db, "pills", "1"))
    compartment1 = compartment1.data()["quantity"];
    console.log("Compartment 1 is " + compartment1)
    console.log("pillConsumed1 is " + pillConsumed1)

    let compartment2 = await getDoc(doc(db, "pills", "2"))
    compartment2 = compartment2.data()["quantity"];
    console.log("Compartment 2 is " + compartment2)
    console.log("pillConsumed2 is " + pillConsumed2)

    if (compartment1 < pillConsumed1) {
      console.log("HERE I AM")
      await updateDoc(doc(db, "pills", "1"), {consumed: true})
    }
    if (compartment2 < pillConsumed2) {
      await updateDoc(doc(db, "pills", "2"), {consumed: true})
    }
    setFlag1(compartment1)
    setFlag2(compartment2)
  }

  return (
    <div className="App">
      <h1>My Pills</h1>

      {/* <button onClick={() => setPopupActive(!popupActive)}>Add Pill</button> */}
      <button onClick={() => pillConsumed()}>Add Pill</button>

      <div className="pills">
        { pills.map((pill, i) => (
          <div className="pill" key={pill.id}>
            <h3>{ pill.name }</h3>

            { pill.viewing && 
            <div>
              <h4>Quantity</h4>
              <h5>{ pill.quantity }</h5>

              <h4>Compartment</h4>
              <h5>{ pill.compartment }</h5>

              <h4>Unit Weight</h4>
              <h5>{ pill.unit }</h5>

              <h4>Schedule</h4>
              <h5>{ pill.schedule }</h5>

              <h4>Close Contacts</h4>
              <ol>
                { pill.emails.map((email, i) => (
                  <li key={i}>● { email }</li>
                ))}
              </ol> 
            </div>}

            <div className="buttons">
              <button onClick={() => handleView(pill.id)}>View { pill.viewing ? 'less' : 'more' }</button>
              <button className="remove" onClick={() => removePill(pill.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      { popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Add a new pill</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type='text' 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Compartment</label>
              <input 
                type='text' 
                value={form.compartment} 
                onChange={e => setForm({...form, compartment: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input 
                type='number' 
                value={form.quantity} 
                onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Unit Weight</label>
              <input 
                type='number' 
                value={form.unit} 
                onChange={e => setForm({...form, unit: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Schedule (MTWRFSU)</label>
              <input 
                type='text' 
                value={form.schedule} 
                onChange={e => setForm({...form, schedule: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Close Contacts (email)</label>
              {
                form.emails.map((email, i) => (
                  <input 
                    type='email'
                    key={i}
                    value={email} 
                    onChange={e => handleEmail(e, i)} />
                ))
              }
              <button type="button" onClick={handleEmailCount}>Add email</button>
            </div>

            <div className="buttons">
              <button type="submit">Submit</button>
              <button type="button" class="remove" onClick={() => setPopupActive(false)}>Close</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}

export default App;