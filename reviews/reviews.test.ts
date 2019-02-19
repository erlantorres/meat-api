import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})

test('post /reviews', () => {
    return request(address)
        .post('/reviews')
        .send({
            date: '2019-02-13T14:30:00.000Z',
            rating: 5,
            comments: 'Da hora!',
            restaurant: '5c673b6e496be33e082cba16',
            user: '5c5f49100c72df1b70d56279'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.comments).toBe('Da hora!')
            expect(response.body.rating).toBe(5)
            expect(response.body.date).toBe('2019-02-13T14:30:00.000Z')
            let restaurantId = response.body.restaurant._id ? response.body.restaurant._id : response.body.restaurant
            expect(restaurantId).toBe('5c673b6e496be33e082cba16')
            let userId = response.body.user._id ? response.body.user._id : response.body.user
            expect(userId).toBe('5c5f49100c72df1b70d56279')
        })
        .catch(fail)
})

test('get /reviews/aaaa - not found', () => {
    return request(address)
        .get('/reviews/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

test.only('get /reviews/:id', () => {
    return request(address)
        .post('/reviews')
        .send({
            date: '2019-02-14',
            rating: 4,
            comments: 'Da hora 2!',
            restaurant: '5c673b6e496be33e082cba17',
            user: '5c5f49100c72df1b70d56280'
        })
        .then(response => {
            console.log('Resposta: ') 
            console.log(response.body.__V)
        }
            // request(address)
            // .get(`/reviews/${response.body._id}`)
        )
        // .then(response => {
        //     expect(response.status).toBe(200)
        //     expect(response.body._id).toBeDefined()
        //     expect(response.body.comments).toBe('Da hora 2!')
        //     expect(response.body.rating).toBe(4)
        //     expect(response.body.date).toBe('2019-02-14T00:00:00.000Z')
        //     let restaurantId = response.body.restaurant._id ? response.body.restaurant._id : response.body.restaurant
        //     expect(restaurantId).toBe('5c673b6e496be33e082cba17')
        //     let userId = response.body.user._id ? response.body.user._id : response.body.user
        //     expect(userId).toBe('5c5f49100c72df1b70d56280')
        // })
        .catch(fail)
})


