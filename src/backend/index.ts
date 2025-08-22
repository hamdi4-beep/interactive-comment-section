import express from 'express'
import { createReadStream, existsSync } from 'fs'

const app = express()
app.listen(3000, () => console.log('Listening for requests on', 3000))

app.get('/comments', (request, response) => {
    const path = '../data/commen.json'

    if (!existsSync(path)) {
        response
            .status(500)
            .end('Something went wrong!\n')

        return
    }

    response.writeHead(200, {
        'access-control-allow-origin': '*',
        'content-type': 'application/json'
    })
    
    createReadStream(path)
        .pipe(response)
        .on('error', console.error)
        .on('finish', () => console.log('Finished streaming the file'))
})