import React from 'react';

const Persons = ({searchName, deletePerson,persons}) => {
  const mapping = (persons) => {
    return (
      persons.map(person => 
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}> delete </button>
        </div>
      )
    )
  }

  return (
    searchName === '' 
      ? mapping(persons)
      : mapping(persons.filter(person => 
        person.name.toLocaleLowerCase()
        .includes(searchName.toLocaleLowerCase())))
  )
}

export default Persons