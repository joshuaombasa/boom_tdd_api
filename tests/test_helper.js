const mongoose = require('mongoose')
const Warehouse = require('../models/warehouse')

const someWarehouses = [{
    name: 'Tropikal',
    location: 'Mombasa Road',
    size: '300 * 600',
    cost: '5000',
},
{
    name: 'Muthokinju',
    location: 'Ruiru',
    size: '600 * 800',
    cost: '2000',
}]

const warehousesInDB = async () => {
    const warehouseObjects = await Warehouse.find({})
    return warehouseObjects.map(warehouse => warehouse.toJSON())
}

const nonExistentWarehouseId = async () => {
    const warehouse = new Warehouse({
        name: 'Tropikal',
        location: 'Mombasa Road',
        size: '300 * 600',
        cost: '5000',
    })
    const addedWarehouse = await warehouse.save()
    await Warehouse.findByIdAndDelete(addedWarehouse._id)
     return addedWarehouse._id.toString()
}



module.exports = {
    someWarehouses,
    nonExistentWarehouseId,
    warehousesInDB
}