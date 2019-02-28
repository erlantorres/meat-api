import * as restify from 'restify'
import * as mongoose from 'mongoose';

import { ModelRouter } from '../common/model-router';
import { Review } from './reviews.model';
import { authorize } from '../security/authz.handler';


class ReviewsRouter extends ModelRouter<Review>{
    constructor() {
        super(Review)
    }

    preparedOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('restaurant', 'name')
            .populate('user', 'name')
    }

    envelope(document: any): any {
        let resource = super.envelope(document)
        const restId = resource.restaurant._id ? resource.restaurant._id : resource.restaurant
        resource._links.restaurant = `/restaurants/${restId}`

        const userId = resource.user._id ? resource.user._id : resource.user
        resource._links.user = `/users/${userId}`
        return resource
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.ValidateId, this.findById])
        application.post(this.basePath, [authorize('user'), this.save])
    }
}

export const reviewsRouter = new ReviewsRouter()