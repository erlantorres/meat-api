import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { Router } from './router'
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    ValidateId = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found!'))
        } else {
            next()
        }
    }

    findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next)
    }

    findById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next)
    }

    save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let user = new this.model(req.body)
        user.save()
            .then(this.render(resp, next))
            .catch(next)
    }

    replace = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const options = { runValidators: true, overwrite: true }
        this.model.update({ _id: req.params.id }, req.body, options)
            .exec()
            .then(result => {
                if (result.n) {
                    return this.findById(req, resp, next)
                }

                throw new NotFoundError('Document not found!')
            })
            .then(this.render(resp, next))
            .catch(next)
    }

    update = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const options = { runValidators: true, new: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next)
    }

    delete = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.model.remove({ _id: req.params.id })
            .exec()
            .then((ret: any) => {
                if (ret.result.n) {
                    resp.send(204)
                } else {
                    throw new NotFoundError('Document not found!')
                }

                return next()
            })
            .catch(next)
    }
}