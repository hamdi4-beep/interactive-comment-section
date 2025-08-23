import express from 'express'
import { createReadStream, existsSync } from 'fs'

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.use((request, response, next) => {
    response.setHeader('access-control-allow-origin', '*')
    next()
})

app.get('/comments', (request, response) => {
    const path = '../data/comments.json'

    if (!existsSync(path)) {
        response
            .status(500)
            .end('Something went wrong!\n')

        return
    }

    response.status(200)
    
    createReadStream(path)
        .on('error', console.error)
        .pipe(response)
})

app.get('/comments/:id', (request, response) => {
    const id = request.params['id']
    let body = ''

    const readStream = createReadStream('../data/comments.json')

    readStream
        .on('data', chunk => body += chunk)
        .on('end', () => {
            const data = JSON.parse(body)

            if (!data.byId[id]) {
                response
                    .status(500)
                    .json({
                        message: `A comment with an ID of ${id} doesn't exists`
                    })
                    .end()

                return
            }

            response
                .status(200)
                .json(data['byId'][id])
                .end()
        })
})

app.get('/replies', (request, response) => {
    const path = '../data/replies.json'

    if (!existsSync(path)) {
        response
            .status(500)
            .end('Something went wrong!\n')

        return
    }

    response.status(200)

    createReadStream(path)
        .on('error', console.error)
        .pipe(response)
})