import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({value, handler}) => {
  return (
    <>
      filter shown with 
        <input 
          value={value} 
          onChange={handler}
        />
    </>
  )

}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input 
        value={newName} 
        onChange={handleNameChange}
      /><br></br>
      number: <input
        value={newNumber}
        onChange={handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({searchName, persons}) => {
  return (
    searchName === '' 
      ? persons.map(person => 
        <div key={person.name}>
          {person.name} {person.number}
        </div>
        )
      : persons.filter(person => 
          person.name.toLocaleLowerCase()
          .includes(searchName.toLocaleLowerCase()))
          .map(person => 
            <div key={person.name}>
              {person.name} {person.number}
            </div>
          )
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {setNewName(event.target.value)}

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    persons.some(val => newName === val.name) 
      ? alert(`${newName} is already added to phonebook`) 
      : setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={searchName} handler={handleSearch}/>

      <h3>add a new</h3>

      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <h3>Numbers</h3>

      <Persons searchName={searchName} persons={persons}/>
    </div>
  )
}

export default App