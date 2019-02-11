import { Server } from './server/server'
import { usersRouter } from './users/users.route'

const server = new Server()
server.bootstrap([usersRouter]).then((server: any) => {
    console.log('Server is listening on: ', server.application.address())
}).catch((error: any) => {
    console.log('Server failed to start')
    console.log(error)
    process.exit(1)
})