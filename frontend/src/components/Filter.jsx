const Filter = ({ filterName, handleFilterChanged }) => {
    return (
        <div>
            filter shown with <input value={filterName} onChange={handleFilterChanged} />
        </div>
    )
}

export default Filter 