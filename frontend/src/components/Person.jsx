const Person = ({personsToShow, handleOnClick}) => {
    return (
        <p>
            {personsToShow.map(
                person =>
                    <li key={person.id}>{person.name} {person.number} <button onClick={() => handleOnClick(person.id, person.name)}>delete</button></li>
            )}
        </p>
    )
}

export default  Person;