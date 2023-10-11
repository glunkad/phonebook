const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Server is running </h1>')
})

app.get('/info', (request, response) => {
    const count = persons.length
    const now = Date()
    response.send(`
    <p>Phonebook has info for ${count} people </p>
    <p> ${now}  </p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log(body)

    if (!body.name) {
        return response.status(400).json({
            error: 'content  missing'
        })
    }

    const nameCheck = persons.find(p => p.name === body.name)
    if (nameCheck) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const numberCheck = persons.find(p => p.number === body.number)
    if (numberCheck) {
        return response.status(400).json({
            error: 'number must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)

})

app.get('/api/persons/:id', (request, respose) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        respose.json(person)
    } else {
        respose.status(404).end()
    }
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})