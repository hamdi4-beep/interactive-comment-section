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
        .pipe(response)
        .on('error', console.error)
        .on('finish', () => console.log('Finished streaming the file'))
})