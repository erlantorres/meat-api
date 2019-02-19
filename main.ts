import { Server } from './server/server'
import { mainRouter } from './main.router';
import { usersRouter } from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reviews.router';


const server = new Server()
server.bootstrap([mainRouter, usersRouter, restaurantsRouter, reviewsRouter]).then((server: any) => {
    console.log('Server is listening on: ', server.application.address())
}).catch((error: any) => {
    console.log('Server failed to start')
    console.log(error)
    process.exit(1)
})