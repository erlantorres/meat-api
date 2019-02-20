import 'jest'
import * as request from 'supertest'


let address: string = (<any>global).address

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})


test('get /users/email - findByEmail', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario findByEmail',
            email: 'findByEmail@email.com',
            password: '123456'
        })
        .then(response => request(address)
            .get('/users')
            .query({ email: 'findByEmail@email.com' }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items[0]._id).toBeDefined()
            expect(response.body.items[0].name).toBe('usuario findByEmail')
            expect(response.body.items[0].email).toBe('findByEmail@email.com')
            expect(response.body.items[0].password).toBeUndefined()
        })
        .catch(fail)
})

test('get /users/aaaa - not found', () => {
    return request(address)
        .get('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

test('post / users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario 1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '031.133.282-09'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario 1')
            expect(response.body.email).toBe('usuario1@email.com')
            expect(response.body.password).toBeUndefined()
            expect(response.body.cpf).toBe('031.133.282-09')
        })
        .catch(fail)
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario 2',
            email: 'usuario2@email.com',
            password: '123456'
        }).then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'usuario 2 - patch'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario 2 - patch')
            expect(response.body.email).toBe('usuario2@email.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})


test('del /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario del',
            email: 'usuariodel@email.com',
            password: '123456',
            cpf: '613.586.318-59',
            gender: 'Male'
        })
        .then(response =>
            request(address)
                .del(`/users/${response.body._id}`))
        .then(response => {
            expect(response.status).toBe(204)
        })
        .catch(fail)
})

// test('put /users/:id', () => {
//     return request(address)
//         .post('/users')
//         .send({
//             name: 'usuario put',
//             email: 'usuarioput@email.com',
//             password: '123456',
//             cpf: '613.586.318-59',
//             gender: 'Male'
//         })
//         .then(response =>
//             request(address)
//                 .put(`/users/${response.body._id}`)
//                 .send({
//                     name: 'usuario 2 - put',
//                     email: 'usuarioput2@gmail.com',
//                     password: '54522',
//                     cpf: '12380088799'
//                 }))
//         .then(response => {
//             console.log(response)
//         })
//         .catch(fail)
// })

/*
return request(address)
    .post('/users')
    .send({

    })
    .then(response =>
        request(address)
            .put(`/users/${response.body._id}`)
            .send({
                name: 'usuario 2 - put',
                email: 'usuarioput2@gmail.com',
                password: '54522',
                cpf: '12380088799'
            }))
    .then(response => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('usuario 2 - put')
        expect(response.body.email).toBe('usuarioput2@email.com')
        expect(response.body.cpf).toBe('123.800.887.99')
        expect(response.body.gender).toBeUndefined()
        expect(response.body.password).toBeUndefined()
    })
    .catch(fail)
    */

test('put /users:/id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario 7',
            email: 'user7@gmail.com',
            password: '123456',
            cpf: '613.586.318-59',
            gender: 'Male'
        }).then(response => request(address)
            .put(`/users/${response.body._id}`)
            .send({
                name: 'usuario 7',
                email: 'user7@gmail.com',
                password: '123456',
                cpf: '613.586.318-59'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuario 7')
            expect(response.body.email).toBe('user7@gmail.com')
            expect(response.body.cpf).toBe('613.586.318-59')
            expect(response.body.gender).toBeUndefined()
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})