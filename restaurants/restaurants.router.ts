import * as restify from 'restify'

import { ModelRouter } from '../common/model-router'
import { Restaurant } from './restaurants.model';
import { NotFoundError } from 'restify-errors';


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

    applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [this.ValidateId, this.findById])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [this.ValidateId, this.replace])
        application.patch('/restaurants/:id', [this.ValidateId, this.update])
        application.del('/restaurants/:id', [this.ValidateId, this.delete])

        application.get('/restaurants/:id/menu', [this.ValidateId, this.findMenu])
        application.put('/restaurants/:id/menu', [this.ValidateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()