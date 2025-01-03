import express from "express";
import request from 'supertest'

import addressRoutes, {addressService} from '.././address.routes'
import {faker} from "@faker-js/faker";
import {addressFactory, generatePhoneNumber} from "../../utils/fixtures";

const app = express()
app.use(express.json())
app.use(addressRoutes)


const mockAddress = ()=>{
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phoneNumber: generatePhoneNumber(),
        preferred: faker.datatype.boolean()
    }
}


describe('Address Routes', ()=>{
    describe('POST /addresses', () => {
        test('should create address successfully', async()=>{
            const requestBody = mockAddress()
            const address =  addressFactory.build()
            jest
                .spyOn(addressService, 'createAddress')
                .mockImplementation(()=> Promise.resolve(address))
            const response = await request(app)
                .post('/addresses')
                .send(requestBody)
                .set('Accept', 'application/json')
            console.log(response.status, response)
            expect(response.status).toBe(201)
            expect(response.body).toEqual(address)
        })

        test('should response with validation error 400', async()=>{
            const requestBody = mockAddress()
            const response = await request(app)
                .post('/addresses')
                .send({...requestBody, firstName:""})
                .set("Accept", 'application/json')
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(400)
            expect(response.body).toEqual('firstName should not be empty')
        })

        test('should response with an internal error code 500', async()=>{
            const requestBody = mockAddress()
            jest
                .spyOn(addressService, 'createAddress')
                .mockImplementation(()=>Promise.reject(new Error('unable to create address')))

            const response = await request(app)
                .post('/addresses')
                .send(requestBody)
                .set('Accept', 'application/json')
            console.log('TEST RESPONSE', response)

            expect(response.status).toBe(500)
            expect(response.body).toEqual("unable to create address")
        })
    });

    describe('PATCH /addresses/:id', ()=>{

        test("should update address successfully", async()=>{
            const address = addressFactory.build()
            const requestBody = {
                firstName: address.firstName,
                lastName: address.lastName,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city:address.city,
                state: address.state,
                zipCode:address.zipCode,
                phoneNumber: address.phoneNumber,
                preferred: address.preferred
            }
            jest.spyOn(addressService, 'updateAddress')
                .mockImplementation(()=>Promise.resolve(address))

            const response = await request(app)
                .patch(`/addresses/${address._id}`)
                .send(requestBody)
                .set('Accept', 'application/json')

            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(address)
        })

        test('should response with validation error 400', async()=>{
            const address = addressFactory.build()
            const requestBody = {
                ...address,
                addressLine1: ""
            }

            const response = await request(app)
                .patch('/addresses/:id')
                .send(requestBody)
                .set("Accept", 'application/json')
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(400)
            expect(response.body).toEqual("addressLine1 should not be empty")
        })

        test("should response with internal error code 500",
            async()=>{
            const address = addressFactory.build()
                const requestBody = mockAddress()
                jest
                    .spyOn(addressService, 'updateAddress')
                    .mockImplementation(()=>Promise.reject(new Error('unable to update address')))

                const response = await request(app)
                    .patch(`/addresses/${address._id}`)
                    .send(requestBody)
                    .set('Accept', 'application/json')
                console.log('TEST RESPONSE', response)
                expect(response.status).toBe(500)
                expect(response.body).toEqual('unable to update address')
            })
    })

    describe('GET /addresses', () => {
        test('should return a list of addresses', async()=>{
            const randomLimit = faker.number.int({min:1, max:8})
            const addresses = addressFactory.buildList(randomLimit)

            jest
                .spyOn(addressService, 'getAddresses')
                .mockImplementation(()=>Promise.resolve(addresses))

            const response =await  request(app)
                .get('/addresses')
                .set('Accept','application/json')
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(addresses)

        })
    });

    describe("GET /addresses':id", ()=>{
        test('should return a address by id', async()=>{
            const address = addressFactory.build()

            jest
                .spyOn(addressService, 'getAddress')
                .mockImplementation(()=>Promise.resolve(address))

            const response = await request(app)
                .get(`/addresses/${address._id}`)
                .set("Accept", "application/json")
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(address)
        })
    })

    describe('Delete /addresses/:id', ()=>{
        test("should delete a address by id", async()=>{
            const address = addressFactory.build()

            jest
                .spyOn(addressService, 'deleteAddress')
                .mockImplementation(()=>Promise.resolve({id:address._id}))
            const response = await request(app)
                .delete(`/addresses/${address._id}`)
                .set("Accept", "application/json")
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({id:address._id})
        })
    })

    describe('PATCH /addresses/preferred/:id', ()=>{
        test("should update preferred status a address by id", async()=>{
            const address = {...addressFactory.build(),preferred: true}

            jest
                .spyOn(addressService, 'setPreferred')
                .mockImplementation(()=>Promise.resolve(address))
            const response = await request(app)
                .patch(`/addresses/preferred/${address._id}`)
                .set("Accept", "application/json")
            console.log('TEST RESPONSE', response)
            expect(response.status).toBe(200)
            expect(response.body).toEqual(address)
        })
    })
})