const mongoose = require('mongoose')
const Warehouse = require('../models/warehouse')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
    await Warehouse.deleteMany({})
    for (let warehouse of helper.someWarehouses) {
        const warehouseObject = new Warehouse(warehouse)
        await warehouseObject.save()
    }
})

describe('when there is initially some warehouses', () => {
    test('warehouses are returned as json', async () => {
        await api.get('/api/warehouses')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all warehouses are returned', async () => {
        const response = await api.get('/api/warehouses')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.someWarehouses.length)
    })

    test('a specific warehouse is among the returned warehouses', async () => {
        const response = await api.get('/api/warehouses/')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const names = response.body.map(r => r.name)
        expect(names).toContain(helper.someWarehouses[0].name)
    })
})

describe('getting a single warehouse', () => {
    test('succeeds when given a valid id', async () => {
        const warehousesInDB = await helper.warehousesInDB()
        const response = await api.get(`/api/warehouses/${warehousesInDB[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })

    test('fails with status code 404 when given nonexistent id', async () => {
        const nonExistentWarehouseId = await helper.nonExistentWarehouseId()
        const response = await api.get(`/api/warehouses/${nonExistentWarehouseId}`)
            .expect(404)
    })

    test('fails with status code 400 when given invalid id', async () => {
        const invalidId = '0'
        const response = await api.get(`/api/warehouses/${invalidId}`)
            .expect(400)
    })
})

describe('adding a new warehouse', () => {
    test('succeeds with status code 201 given valid data', async () => {
        const warehousesAtStart = await helper.warehousesInDB()
        const kishash = {
            name: 'Thiya',
            location: 'Ruiru',
            size: '400 * 900',
            cost: '2000',
        }
        const response = await api.post('/api/warehouses/')
            .send(kishash)
            .expect(201)
        const warehousesAtEnd = await helper.warehousesInDB()
        expect(warehousesAtEnd).toHaveLength(warehousesAtStart.length + 1)
    })

    test('fails with status code 400 given invalid data', async () => {
        const warehousesAtStart = await helper.warehousesInDB()
        const kishash = {
            location: 'Naivasha',
            size: '400 * 900',
            cost: '2000',
        }
        const response = await api.post('/api/warehouses/')
            .send(kishash)
            .expect(400)
        const warehousesAtEnd = await helper.warehousesInDB()
        expect(warehousesAtEnd).toHaveLength(warehousesAtStart.length)
    })
})

describe('updating a warehouse', () => {
    test('succeeds given correct id and data', async () => {
        const warehousesAtStart = await helper.warehousesInDB()
        const kishash = {
            name: 'Manyaru',
            location: 'Ruiru',
            size: '400 * 900',
            cost: '2000',
        }
        await api.put(`/api/warehouses/${warehousesAtStart[0].id}`)
            .send(kishash)
            .expect(201)
        const warehousesAtEnd = await helper.warehousesInDB()
        expect(warehousesAtEnd).toHaveLength(warehousesAtStart.length)
    })

    test('fails with status code 400 given non-Existent Warehouse Id', async () => {
        const warehousesAtStart = await helper.warehousesInDB()
        const nonExistentWarehouseId = await helper.nonExistentWarehouseId()
        const kishash = {
            cow: 'wdwef',
            size: '400 * 900',
            cost: '2000',
        }
        await api.put(`/api/warehouses/${nonExistentWarehouseId}`)
            .send(kishash)
            .expect(404)
        const warehousesAtEnd = await helper.warehousesInDB()
        expect(warehousesAtEnd).toHaveLength(warehousesAtStart.length)
    })
})


describe('deleting a warehouse', () => {
    test('succeeds given a valid id', async () => {
        const warehousesAtStart = await helper.warehousesInDB()
        await api.delete(`/api/warehouses/${warehousesAtStart[0].id}`)
            .expect(204)
            const warehousesAtEnd = await helper.warehousesInDB()
            expect(warehousesAtEnd).toHaveLength(warehousesAtStart.length -  1)
    })
})

afterAll(async () => {
    mongoose.connection.close()
})