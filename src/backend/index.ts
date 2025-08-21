import { error } from 'console'
import express, { response } from 'express'
import { createReadStream } from 'fs'
import { pipeline } from 'stream'

const fs = createReadStream('../data/comments.json')

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.get('/comments', (request, response) => {
    response.writeHead(200, {
        'content-type': 'application/json'
    })
    
    fs
        .pipe(response)
        .on('error', err => {
            response
                .writeHead(500, {'content-type': 'text/plain'})
                .end('Something went wrong!')
        })
})