import * as restify from 'restify'
import * as mongoose from 'mongoose';

import { ModelRouter } from '../common/model-router';
import { Review } from './reviews.model';


class ReviewsRouter extends ModelRouter<Review>{
    constructor() {
        super(Review)
    }

    preparedOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('restaurant', 'name')
            .populate('user', 'name')
    }

    applyRoutes(application: restify.Server) {
        application.get(this.basePath, this.findAll)
        application.get(`${this.basePath}/:id`, [this.ValidateId, this.findById])
        application.post(this.basePath, this.save)
    }
}

export const reviewsRouter = new ReviewsRouter()