import { useState, useEffect } from 'react'

import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

import phonebookService from './services/person'


const App = () => {

  const [persons, setPersons] = useState([])

  const [filterName, setFilterName] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState({})

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPhonebook => {
        setPersons(initialPhonebook)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    const duplicate = persons.find((p) => p.name.toLowerCase() === newName.toLowerCase())

    if (duplicate && duplicate.number === newNumber) {
      alert(`${newName} is already added to phonebook`)
    }

    else if (duplicate && duplicate.number !== newNumber) {

      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (confirm) {
        const personToChange = { ...duplicate, number: newNumber }
        phonebookService
          .update(duplicate.id, personToChange)
          .then(returnedPerson => {
            setPersons(persons.map(n => n.id !== duplicate.id ? n : returnedPerson))
          })
          .catch(error => {
            setTimeout(() => {
              setMessage({
                error: true,
                text: `Information of ${newName} has already been removed from server`
              }, 5000)
            })
          })
        setNewName('')
        setNewNumber('')
      }
    }

    else {

      const personObject = {
        name: newName,
        number: newNumber,
      }

      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setTimeout(() => {
            setMessage({ error: false, text: `Added ${newName}` });
          }, 5000);
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {

    const personToDelete = persons.find(person => person.id === id)

    const confirm = window.confirm(`Delete ${personToDelete.name}`)

    if (!confirm) {
      console.log('Delete operation cancelled!')
    }

    else {
      phonebookService
        .deleteObject(id)
        .then(personsToReturn => {
          persons.map(personToDelete => personToDelete.id !== id ? personToDelete : persons)
        })

      setPersons(persons.filter(person => person.id !== id))

      console.log(`${personToDelete.name} deleted!`)
    }

  }

  const handleFilterChanged = (event) => {
    setFilterName(event.target.value)
  }

  const handleNameChanged = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChanged = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = persons.map(
    p => p.name.toLowerCase().includes(filterName.toLowerCase()))
    ?
    persons.filter(
      p =>
        p.name.toLowerCase().includes(filterName.toLowerCase())) :
    persons


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filterName} handleFilterChanged={handleFilterChanged} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChanged={handleNameChanged} newNumber={newNumber} handleNumberChanged={handleNumberChanged} />
      <h3>Number</h3>
      <div>
        {personsToShow.map(person =>
          <Person key={person.id}
            name={person.name}
            number={person.number}
            deletePerson={() => deletePerson(person.id)} />
        )}
      </div>
    </div>
  )
}
export default App
