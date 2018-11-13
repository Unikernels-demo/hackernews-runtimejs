'use strict'

const fs = require('fs'),
    ESHttp = require('eshttp')

const htmlPageContent = fs.readFileSync(__dirname + './static/index.html', 'utf8')
let posts = ""

fetchPosts()

const server = new ESHttp.HttpServer()
server.onrequest = request => {
    if (request._parser._path === '/api/posts') {
        request.respondWith(new ESHttp.HttpResponse(200, { server: 'demo' }, posts))
    }
    else {
        request.respondWith(new ESHttp.HttpResponse(200, { server: 'demo' }, htmlPageContent))
    }
}

const kernelVersion = __SYSCALL.version();
console.log(`RuntimeJS kernel: ${kernelVersion.kernel} v8: ${kernelVersion.v8} ${Date.now()} x86_64`)

server.listen(9000)
console.log('listening to port 9000')

function fetchPosts() {
    const client = new ESHttp.HttpClient('192.168.1.102', 8080)
    const request = new ESHttp.HttpRequest('GET', '/api/posts')

    client.request(request, function (err, response) {
        let tmp = ""

        if (err !== null) {
            tmp = "[]"
            console.log(err)
        }
        else {
            console.log("Connected to the posts database")
        }

        response.ondata = function (buf) {
            console.log("got a chunck of size ", buf.length)
            Object.keys(buf).map(function (key) {
                tmp += String.fromCharCode(buf[key]);
            })
        }

        response.onend = function () {
            console.log("got all posts from the database")
            posts = tmp
        }
    })
}