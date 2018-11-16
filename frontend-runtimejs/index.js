'use strict'

const fs = require('fs'),
    ESHttp = require('eshttp')

const htmlPageContent = fs.readFileSync(__dirname + './static/index.html', 'utf8')
    .replace("@@API_URL@@", "http://localhost:8000")

const server = new ESHttp.HttpServer()
server.onrequest = request => {
    request.respondWith(new ESHttp.HttpResponse(
        200,
        { server: 'hackernews runtimejs unikernel demo' },
        htmlPageContent.replace("@@TIME@@", Date.now())
    ))
}

const kernelVersion = __SYSCALL.version()
console.log(`RuntimeJS kernel: ${kernelVersion.kernel}`)
console.log(`V8: ${kernelVersion.v8}`)
console.log(`Date: ${Date.now()}`)

server.listen(9000)
console.log('listening to port 9000')