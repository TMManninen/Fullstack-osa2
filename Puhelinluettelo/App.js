import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'


const Notification = ({ message }) => {
    if (message == null) {
        return null
    }

    return (
        <div className="notification">
            {message}
        </div>
        )
}


const Error = ({ message }) => {
    if (message == null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}


const Persons = (props) => {
    return (
        <div>
            {props.numbersToShow}
        </div>
    )
}

const Filter = (props) => {
    return(
        <div>
        filter shown with <input
            value={props.toShow}
            onChange={props.handleFiltering}
        />
        </div>
        )
}

const Form = (props) => {
    return (
        <form onSubmit={props.addName}>
            <div>
                name: <input
                    value={props.newName}
                    onChange={props.handleChange}
                />
            </div>
            <div>
                number: <input
                    value={props.newNumber}
                    onChange={props.numberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
        )
}

const App = () => {
    
    const [persons, setPersons] = useState([])

    useEffect(() => {
        personService
            .getAll()
            .then(response => {
                setPersons(response.data)
            })
    }, [])
    
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [toShow, setToShow] = useState('')
    const [notification, setNotification] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)



    const addName = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber,
            id: persons.length + 1
        }

        const duplicate = persons.find(person => person.name === newName)

        if (duplicate !== undefined) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personService
                    .update(duplicate.id, personObject)
                    .then(response => {
                        setNotification(
                            `Number of ${personObject.name} updated`
                        )
                        setTimeout(() => {
                            setNotification(null)
                        }, 3000)
                        setPersons(persons.map(person => person.name !== duplicate.name ? person : response.data))
                    })
                    .catch(error => {
                        setErrorMessage(
                            `Information of '${personObject.name}' was already removed from server`
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 3000)

                        setNewName('')
                        setNewNumber('')
                        
                        setPersons(persons.filter(p => p.name !== personObject.name))
                    }
                )
            }
        }

        else {
            personService
                .create(personObject)
                .then(response => {
                    console.log(response)
                })
            setPersons(persons.concat(personObject))
            setNotification(
                `${personObject.name} added`
            )
            setTimeout(() => {
                setNotification(null)
            }, 3000)
            setNewName('')
            setNewNumber('')
        }
        
        
    }

    const handleChange = (event) => {
        setNewName(event.target.value)
    }

    const numberChange = (event) => {
        setNewNumber(event.target.value)
    }




    const handleFiltering = (event) => {
        setToShow(event.target.value)
    }

    const numbersToShow = () => {
        const result = persons.filter(person => person.name.toLowerCase().includes(toShow.toLowerCase()))
        return result.map((person) => (
            <div key={person.name}>
                <p>
                    {person.name} {person.number}
                    <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
                </p>
            </div>
        ))
    }

    const deletePerson = (id, name) => {
        console.log(id)
        if (window.confirm(`Delete ${name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    personService
                        .getAll()
                        .then(response => 
                            setPersons(response.data)
                    )
                })
            setNotification(
                `${name} deleted`
            )
            setTimeout(() => {
                setNotification(null)
            }, 3000)
            }
                
        
    }

  return (
    <div>
          <h2>Phonebook</h2>
          <Notification message={notification} />
          <Error message={errorMessage} />
          <Filter toShow={toShow} handleFiltering={handleFiltering} />
          <h3>Add a new</h3>
          <Form addName={addName} newName={newName} handleChange={handleChange} newNumber={newNumber} numberChange={numberChange} />
          <h3>Numbers</h3>
          <Persons numbersToShow={numbersToShow()} />
    </div>
  )

}

export default App
