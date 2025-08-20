import { createServer } from "http";

const server = createServer((request, response) => {
    console.log('Recieved a request with the URL:', request.url)

    response
        .writeHead(200, {
            'content-type': 'text/plain'
        })
        .end('OK')
})

server.listen(3000, () => console.log('Listening to requests on port:', 3000))