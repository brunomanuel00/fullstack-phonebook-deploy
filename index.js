require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status - :response-time ms :body'));

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


//Get all persons
app.get('/api/persons', (_request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//Get person by id
app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
            // response.status(404).json({ error: 'person not found' })
        }
    }).catch(error => next(error))

})

//Delete person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            if (deletedPerson) {
                response.status(204).end()
            } else {
                response.status(404).json({ error: 'person not found' })
            }
        })
        .catch(error => next(error))
})


//Post person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).send({
            error: 'content missing'
        })
    }

    Person.findOne({ name: body.name })
        .then(uniqueName => {
            if (uniqueName) {
                return response.status(400).json({
                    error: 'name must be unique'
                })
            }

            console.log('este es el body del post', body)

            const person = new Person({
                name: body.name,
                number: body.number
            })

            return person.save()
        })
        .then(savedPerson => {
            if (savedPerson) {
                response.json(savedPerson)
            }
        })
        .catch(error => next(error))
})

//Put person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

//Get info
app.get('/api/info', (_request, response) => {
    Person.countDocuments({})
        .then(count => {
            const time = new Date()
            response.send(`
                <div>
                    <p>Phonebook has info for ${count} people</p>
                    <p>${time}</p>
                </div>
            `)
        })
        .catch(error => {
            response.status(500).json({ error: 'error retrieving info' })
        })
})


const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'MongooseError') {
        return response.status(500).send({
            error: 'error al obtener información'
        })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})