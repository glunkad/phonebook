import {useEffect, useState} from 'react'

import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Person from "./components/Person.jsx";

import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        personService
            .getAll()
            .then(initialPerson => {
                setPersons(initialPerson)
            })
            .catch(error => console.error(error))
    }, [])

    console.log('render',persons.length, 'persons')

    const addPerson = (event) => {
        event.preventDefault()

        const foundPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

        const personObject = {
            name: newName,
            number: newNumber,
        }

        if(foundPerson && foundPerson.number === newNumber){
            alert(`${newName} is already added to phonebook`)
            return
        }
        else if(foundPerson && foundPerson.number !== newNumber){
            if(window.confirm(`${foundPerson.name} is already added to phonebook, replace the old number with a new one?`)){
                const changedPerson = {...foundPerson,number: newNumber }
                personService
                    .update(foundPerson.id, changedPerson)
                    .then(personsToReturn => {
                        setPersons(persons.map(p => p.id !== foundPerson.id ? p : personsToReturn))
                        setNewName('')
                        setNewNumber('')
                    })
            }
        }
        else{
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                })
        }
    }

    const removePerson = (id, name) => {

        if (!window.confirm(`Delete ${name}`)) {
            return
        }

        personService
            .deletePerson(id)
            .then((res) => setPersons(persons.filter((person) => person.id !== id))
            )
    }

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
        console.log(event.target.value)
        setSearch(event.target.value)
    }

    const personsToShow = persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter handleSearchChange={handleSearchChange}/>
            <h2>add a new </h2>
            <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <Person personsToShow={personsToShow} handleOnClick={removePerson}/>
        </div>
    )
}

export default App