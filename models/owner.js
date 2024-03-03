const mongoose = require('mongoose')

const ownerSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    name:{ type: String, required: true },
    passwordHash:{ type: String, required: true },
    warehouses:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }]
})

ownerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
            delete returnedObject._id,
            delete returnedObject.__v

            delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Owner',ownerSchema)