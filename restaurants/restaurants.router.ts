import * as restify from 'restify'

import { ModelRouter } from '../common/model-router'
import { Restaurant } from './restaurants.model';
import { NotFoundError } from 'restify-errors';
import { authorize } from '../security/authz.handler';


class RestaurantsRouter extends ModelRouter<Restaurant>{
    constructor() {
        super(Restaurant)
    }

    findMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurant not found!')
                } else {
                    resp.json(rest.menu)
                    return next()
                }
            })
            .catch(next)
    }

    replaceMenu = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {
                if (!rest) {
                    throw new NotFoundError('Restaurant not found!')
                } else {
                    rest.menu = req.body
                    return rest.save()
                }
            }).then(rest => {
                resp.json(rest.menu)
                return next()
            })
            .catch(next)

    }

    envelope(document: any): any {
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/menu`
        return resource
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.ValidateId, this.findById])
        application.post(this.basePath, [authorize('admin'), this.save])
        application.put(`${this.basePath}/:id`, [authorize('admin'), this.ValidateId, this.replace])
        application.patch(`${this.basePath}/:id`, [authorize('admin'), this.ValidateId, this.update])
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.ValidateId, this.delete])

        application.get(`${this.basePath}/:id/menu`, [authorize('admin'), this.ValidateId, this.findMenu])
        application.put(`${this.basePath}/:id/menu`, [authorize('admin'), this.ValidateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()