import express from 'express'
import { createReadStream, existsSync } from 'fs'

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.get('/comments', (request, response) => {
    const path = '../data/comments.json'

    if (!existsSync(path)) {
        response
            .status(500)
            .end('Something went wrong!\n')

        return
    }
    
    createReadStream(path)
        .pipe(response)
        .on('error', console.error)
        .on('finish', () => console.log('Finished streaming the file'))
})

app.get('/comments/:id', (request, response) => {
    const id = request.params['id']
    let body = ''

    const readStream = createReadStream('../data/comments.json')

    readStream
        .on('data', chunk => body += chunk)
        .on('end', () => {
            body = JSON.parse(body)

            const data = (body as unknown as {
                'byId': {
                    [key: string]: Object
                }
            })

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