'use strict';
const fs = require('fs'),
      HttpResponse = require('eshttp').HttpResponse,
      HttpServer = require('eshttp').HttpServer,
      HttpClient = require('eshttp').HttpClient,
      HttpRequest = require('eshttp').HttpRequest

const indexHtml = fs.readFileSync(__dirname + './static/index.html', 'utf8')

const request = new HttpRequest('GET', '/', { 'x-header': 'value' });
const client = new HttpClient('192.168.1.102', 8080);
let posts = "";

client.request(request, function(err, response) {
    let tmp = "";

    if (err !== null) {
        tmp = "[]"
        console.log(err)
    }
    else {
        console.log("Connected to the posts database")
    }

    response.ondata = function(buf) {
        console.log("got a chunck of size ", buf.length)
        var result = Object.keys(buf).map(function(key) {
	  tmp += String.fromCharCode(buf[key]);
        });
    }

    response.onend = function() {
        console.log("got all posts from the database")
        posts = tmp;
    }
})

const server = new HttpServer()
server.onrequest = request => {
    if (request._parser._path === '/api/posts') {
        request.respondWith(new HttpResponse(200, { server: 'demo' }, posts))
    }
    else {
        request.respondWith(new HttpResponse(200, { server: 'demo' }, indexHtml))
    }
}

server.listen(9000)

const kernelVersion = __SYSCALL.version();
console.log(`RuntimeJS kernel: ${kernelVersion.kernel} v8: ${kernelVersion.v8} ${Date.now()} x86_64`)
console.log('listening to port 9000')
