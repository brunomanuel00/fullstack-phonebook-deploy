const logger = require('./logger')
const morgan = require('morgan');


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

const morganMiddleware = morgan(':method :url :status - :response-time ms :body');


const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};


const errorHandler = (error, _request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'MongooseError') {
        return response.status(500).send({
            error: 'error al obtener información'
        });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    morganMiddleware,
    unknownEndpoint,
    errorHandler
};
