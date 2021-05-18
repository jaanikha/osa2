import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import personService from './services/persons'
import './index.css'


const Filter = (props) => {

  let persons = props.persons
  let filter = props.filter

  const personsNew = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      Filter shown with <input value={filter} onChange={props.handleFilter}/>
      <AllPersons personsNew={personsNew} deletePerson={props.deletePerson}/>
    </div>
  )}


const AllPersons = (props) => {

  const personsNewNew = props.personsNew

  return (
    <div>
      {personsNewNew.map(person => 
        <div key={person.name} >
          <li> 
            {person.name} {person.number} 
            <button onClick={() => props.deletePerson(person.id)}>
              Delete
            </button>
          </li>
        </div>
      )}
    </div>
  )
}


const PersonForm = (props) => {

  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
        <br/>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
        <br/>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setNewFilter ] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')


  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if ( persons.map(person => person.name.toLowerCase()).indexOf(newName.toLowerCase()) === -1 ) {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')

      personService
      .create(nameObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setSuccessMessage(`'${newName}' was  successfully added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })

    } else {

      const personId = persons[persons.map(person => person.name.toLowerCase()).indexOf(newName.toLowerCase())].id

      if (window.confirm(`${nameObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(personId, nameObject)
          .then(returnedPerson => {
          setPersons(persons.map(person => person.name.toLowerCase() !== nameObject.name.toLowerCase() ? person : returnedPerson))
        setSuccessMessage(`${newName}'s phone number was successfully changed`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        })
        .catch(error => {
          setErrorMessage(`the number of '${nameObject.name}' was already deleted from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== personId))
        })
      }
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  
  const deletePerson = (id) => {
    console.log(id);

    if (window.confirm(`Remove ${persons.find(person => person.id === id).name} ?`)) {
    personService
    .remove(id)
    setSuccessMessage(`'${persons.find(person => person.id === id).name}' was  successfully removed`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    setPersons(persons.filter(person => person.id !== id))
  }};

  return (
    <div>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <h1>Phonebook</h1>
      <h2>Add a new name</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        <Filter persons={persons} filter={filter} handleFilter={handleFilter} deletePerson={deletePerson}/>
      </ul>
    </div>
  )}


ReactDOM.render(<App />, document.getElementById('root'))