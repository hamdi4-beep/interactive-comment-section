import express from 'express'
import { createReadStream } from 'fs'

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.get('/comments', (request, response) => {
    response.writeHead(200, {
        'access-control-allow-origin': '*',
        'content-type': 'application/json'
    })
    
    createReadStream('../data/comments.json')
        .pipe(response)
        .on('error', console.error)
        .on('finish', () => console.log('Finished streaming the file'))
})