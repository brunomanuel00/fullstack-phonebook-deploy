const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

    .then(_result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                console.log('Validando número:', v);
                if (!v) return false;

                const phoneRegex = /^(\d{2,3})-(\d{6,})$/;
                const isValidFormat = phoneRegex.test(v);
                const isValidLength = v.length >= 8;

                console.log('¿Formato válido?:', isValidFormat);
                console.log('¿Longitud válida?:', isValidLength);

                return isValidFormat && isValidLength;
            },
            message: props => {
                console.log('Valor inválido recibido:', props.value);
                return `${props.value} no es un número de teléfono válido. El formato debe ser XX-XXXXXX o XXX-XXXXX con una longitud mínima de 8 caracteres.`;
            }
        }
    }
})


personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)