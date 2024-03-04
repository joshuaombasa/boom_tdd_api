const Owner = require('../models/owner')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
require('dotenv').config()

loginRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const owner = await Owner.findOne({ username })
    const passwordCorrect = await bcrypt.compare(password, owner.passwordHash)
    if (!(owner && passwordCorrect)) {
        return response.status(401).json({ error: 'invalid username or password' })
    }
    const ownerObjectForToken = {
        username,
        name,
        password
    }

    const token = jwt.sign(ownerObjectForToken, process.env.SECRET, {validFor: ''})
    try {
        response.json({token, username: owner.username, name: owner.name})
    } catch (error) {
        next(error)
    }
})

module.exports = loginRouter
