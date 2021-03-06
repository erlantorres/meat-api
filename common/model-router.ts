import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { Router } from './router'
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number = 20

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${this.model.collection.name}`
    }

    protected preparedOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query
    }

    envelope(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    envelopeAll(documents: any[], options: any = {}) {
        const resource: any = {
            _links: {
                self: options.url
            },
            items: documents
        }
        if (options.page && options.pageSize && options.count) {

            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?page=${options.page - 1}`
            }

            const remaining = options.count - (options.page * options.pageSize)
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?page=${options.page + 1}`
            }
        }

        return resource
    }

    ValidateId = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found!'))
        } else {
            next()
        }
    }

    findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let page = parseInt(req.params.page || 1)
        page = page > 0 ? page : 1
        const limit = parseInt(req.params.pageSize || this.pageSize)
        const skip = ((page - 1) * limit)

        this.model
            .count({}).exec()
            .then(count => {
                this.model.find(req.query).skip(skip).limit(limit)
                    .then(this.renderAll(resp, next, { page, pageSize: limit, count, url: req.url }))
            })
            .catch(next)

    }

    findById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        this.preparedOne(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next)
    }

    save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        let model = new this.model(req.body)
        model.save()
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