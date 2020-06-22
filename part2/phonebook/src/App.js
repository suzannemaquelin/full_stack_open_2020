import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Persons from './components/persons'
import Filter from './components/filter'
import PersonForm from './components/personform'
import Notification from './components/notification'
import ErrorNotification from './components/errornotification'
import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ errorNotification, setErrorNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const handleNameChange = (event) => {setNewName(event.target.value)}

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(val => newName === val.name)) { 
      replaceNumber(personObject)
    } else { 
      submitPerson(personObject)
    }
    setNewName('')
    setNewNumber('')
  }

  const replaceNumber = (personObject) => {
    if(window.confirm(`${newName} is already added to phonebook, 
      replace the old number with a new one?`)) {
      const id = persons.find(person => person.name === newName).id
      personService.update(id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNotification(`Number of ${returnedPerson.name} is changed`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          console.log(error.response.data)
          setErrorNotification(error.response.data.error)
          setTimeout(() => {
            setErrorNotification(null)
          }, 3000)
        })
    }
  }

  const submitPerson = (personObject) => {
    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
      .catch(error => {
        console.log(error.response.data)
        setErrorNotification(error.response.data.error)
        // setErrorNotification(`Adding ${personObject.name} failed`)
        setTimeout(() => {
          setErrorNotification(null)
        }, 5000)
      })
  }

  const handleDeletePerson = (person) => {
    window.confirm(`Delete ${person.name}?`)
      ? personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.name !== person.name))
        })
        .catch(error => {
          setErrorNotification(`Deleting ${person.name} failed`)
          setTimeout(() => {
            setErrorNotification(null)
          }, 3000)
        })
      : console.log('not deleted due to cancelation')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorNotification}/>

      <Notification message={notification}/>
      
      <Filter value={searchName} handler={handleSearch}/>

      <h3>add a new</h3>

      <PersonForm addPerson={handleAddPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <h3>Numbers</h3>

      <Persons searchName={searchName} deletePerson={handleDeletePerson} persons={persons}/>
    </div>
  )
}

export default App