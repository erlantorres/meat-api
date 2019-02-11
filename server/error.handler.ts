import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    // console.log(err)
    err.toJSON = () => {
        return {
            name: err.name,
            message: err.message
        }
    }

    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400
            }
            break
        case 'ValidationError':
            err.statusCode = 400

            const messages: any[] = []

            for (let error in err.errors) {
                messages.push({
                    name: err.errors[error].name,
                    message: err.errors[error].message
                })
            }

            err.toJSON = () => ({
                errors: messages
            })
            
            break

        default:
            break
    }

    done()
}