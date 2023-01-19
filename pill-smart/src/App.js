import { db } from "./firebase"
import { useState, useEffect } from "react"
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore"

function App() {
  const [pills, setPills] = useState([])
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    unit: 0,
    schedule: "",
    emails: [],
  })
  const [popupActive, setPopupActive] = useState(false)

  const pillsCollectionRef = collection(db, "pills")
  console.log(pillsCollectionRef)

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
  }, [])

  const handleView = id => {
    const pillsClone = [...pills]
    
    pillsClone.forEach(pill => {
      if (pill.id == id) {
        pill.viewing = !pill.viewing
      } else {
        pill.viewing = false
      }
    })

    setPills(pillsClone)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.name || !form.quantity || !form.unit || !form.schedule) {
      alert("Please fill out all required fields")
      return
    }

    addDoc(pillsCollectionRef, form)

    setForm({
        name: "",
        quantity: 0,
        unit: 0,
        schedule: "",
        emails: []
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

  return (
    <div className="App">
      <h1>My Pills</h1>

      <button onClick={() => setPopupActive(!popupActive)}>Add Pill</button>

      <div className="pills">
        { pills.map((pill, i) => (
          <div className="pill" key={pill.id}>
            <h3>{ pill.name }</h3>

            {/*<p dangerouslySetInnerHTML={{ __html: recipe.schedule}}></p>*/}

            { pill.viewing && 
            <div>
              <h4>Quantity</h4>
              <h5>{ pill.quantity }</h5>

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