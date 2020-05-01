import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Persons from './components/persons'
import Filter from './components/filter'
import PersonForm from './components/personform'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')

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
      const id = persons.find(person => person.name == newName).id
      personService.update(id, personObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        })
    }
  }

  const submitPerson = (personObject) => {
    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
      .catch(error => {console.log('fail')})
  }

  const handleDeletePerson = (person) => {
    window.confirm(`Delete ${person.name}?`)
      ? personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.name != person.name))
        })
      : console.log('not deleted due to cancelation')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={searchName} handler={handleSearch}/>

      <h3>add a new</h3>

      <PersonForm addPerson={handleAddPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <h3>Numbers</h3>

      <Persons searchName={searchName} deletePerson={handleDeletePerson} persons={persons}/>
    </div>
  )
}

export default App