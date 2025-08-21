import express from 'express'
import { createReadStream } from 'fs'

const fs = createReadStream('../data/comments.json')

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.get('/comments', (request, response) => {
    response.writeHead(200, {
        'access-control-allow-origin': '*',
        'transfer-encoding': 'chunked'
    })
    
    fs
        .pipe(response)
        .on('error', err => {
            response
                .status(500)
                .end('Something went wrong!')
        })
})