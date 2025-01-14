require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))



morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status - :response-time ms :body'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './dist', 'index.html'));
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// const getInfo = () => {
//     const time = new Date()
//     const total = persons.length

//     return (
//         `<div>
//             <p>Phonebook has info for ${total} people</p>
//             <p>${time}</p>
//         </div>`
//     )
// }

// app.get('/api/info', (request, response) => {
//     response.send(getInfo())
// })

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)
//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(note => note.id !== id)
//     response.status(204).end()
// })


// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name || !body.number) {
//         return response.status(400).json({
//             error: 'content missing'
//         })
//     }

//     const uniqueName = persons.find(person => person.name === body.name)

//     if (uniqueName) {
//         return response.status(400).json({
//             error: 'name must be unique'
//         })
//     }

//     persons = persons.concat(persons)

//     response.json(persons)
// })


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})