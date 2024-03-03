const warehouseRouter = require('express').Router()
const Warehouse = require('../models/warehouse')

warehouseRouter.get('/', async (request, response, next) => {
    try {
        const warehouses = await Warehouse.find({})
        response.json(warehouses)
    } catch (error) {
        next(error)
    }
})

warehouseRouter.get('/:id', async (request, response, next) => {
    try {
        const warehouse = await Warehouse.findById(request.params.id)
        if (!warehouse) {
            return response.status(404).end()
        }
        response.json(warehouse)
    } catch (error) {
        next(error)
    }
})

warehouseRouter.post('/', async (request, response, next) => {
    const { name, location, size, cost } = request.body
    const warehouse = new Warehouse({
        name,
        location,
        size,
        cost
    })

    try {
        const savedWarehouse = await warehouse.save()
        response.status(201).json(savedWarehouse)
    } catch (error) {
        next(error)
    }
})

warehouseRouter.put('/:id', async (request, response, next) => {
    const { name, location, size, cost } = request.body

    const oldwarehouse = await Warehouse.findById(request.params.id)
    if (!oldwarehouse) {
        return response.status(404).end()
    }

    const warehouse = {
        name,
        location,
        size,
        cost
    }
    try {
        const some = await Warehouse.findById(request.params.id)
        const updatedWarehouse = await Warehouse.findByIdAndUpdate(
            request.params.id,
            warehouse,
            { new: true }
        )
        response.status(201).json(updatedWarehouse)
    } catch (error) {
        next(error)
    }
})

warehouseRouter.delete('/:id', async (request, response, next) => {
    try {
        await Warehouse.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})




module.exports = warehouseRouter