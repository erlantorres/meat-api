import * as restify from 'restify'

import { User } from './users.model'
import { ModelRouter } from '../common/model-router'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.ValidateId, this.findById])
        application.post(this.basePath, this.save)
        application.put(`${this.basePath}/:id`, [this.ValidateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.ValidateId, this.update])
        application.del(`${this.basePath}/:id`, [this.ValidateId, this.delete])
    }
}

export const usersRouter = new UsersRouter()