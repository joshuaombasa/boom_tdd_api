const mongoose = require('mongoose')
const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: String, required: true },
    cost: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
})

warehouseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
            delete returnedObject._id,
            delete returnedObject.__v
    }
})

module.exports = mongoose.model('Warehouse',warehouseSchema)