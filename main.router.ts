import * as restify from 'restify'

import { Router } from "./common/router";

class MainRouter extends Router {
    applyRoutes(application: restify.Server) {
        application.get('/', (req, resp, next) => {
            resp.json({
                _links: {
                    users: '/users',
                    restaurants: '/restaurants',
                    reviews: '/reviews'
                }
            })
            
            return next()
        })
    }
}

export const mainRouter = new MainRouter()