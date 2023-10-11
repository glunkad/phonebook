const Person = ({ name, number, deletePerson }) => {
    return (
        <div>
            {name} {number} &nbsp;
            <button onClick={deletePerson}>delete</button>
        </div>
    )
}
export default Person 