
const Owner = require('../models/owner')
const ownersRouter = require('express').Router()
const bcrypt = require('bcrypt')

ownersRouter.get('/', async (request, response, next) => {
    try {
        const owners = await Owner.find({})
        response.json(owners)
    } catch (error) {
        next(error)
    }
})

ownersRouter.get('/:id', async (request, response, next) => {
    try {
        const owner = await Owner.findById(request.params.id)
        if (!owner) {
            return response.status(400).end()
        }
        response.json(owner)
    } catch (error) {
        next(error)
    }
})

ownersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltrounds = 10
    const passwordHash = await bcrypt.hash(password, saltrounds)
    const owner = new Owner({
        username,
        name,
        passwordHash
    })
    try {
        const savedOwner = await owner.save()
        response.status(201).json(savedOwner)
    } catch (error) {
        next(error)
    }
})

ownersRouter.put('/:id', async (request, response, next) => {
    const owner = await Owner.findById(request.params.id)
    if (!owner) {
        return response.status(400).end()
    }
    const { username, name, password } = request.body
    const saltrounds = 10
    const passwordHash = await bcrypt.hash(password, saltrounds)
    const ownerData = {
        username,
        name,
        passwordHash
    }
    try {
        const updatedOwner = await owner.findByIdAndUpdate(
            request.params.id,
            ownerData,
            { new: true }
        )
        response.status(201).json(updatedOwner)
    } catch (error) {
        next(error)
    }
})

ownersRouter.delete('/:id', async (request, response, next) => {
    try {
        await Owner.findByIdAndDelete(request.params.id)
    } catch (error) {
        next(error)
    }
})

module.exports = ownersRouter