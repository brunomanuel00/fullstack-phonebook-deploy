const personsRouter = require('express').Router()
const Person = require('../models/person')

//Get all persons
personsRouter.get('/persons', (_request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//Get person by id
personsRouter.get('/persons/:id', (request, response, next) => {

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
personsRouter.delete('/persons/:id', (request, response, next) => {
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
personsRouter.post('/persons', (request, response, next) => {
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

            logger.info('este es el body del post', body)

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
personsRouter.put('/persons/:id', (request, response, next) => {
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
personsRouter.get('/info', (_request, response) => {
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

module.exports = personsRouter