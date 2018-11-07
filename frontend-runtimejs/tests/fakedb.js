// content of index.js
const http = require('http')
const port = 8080

const posts = [
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
    {
        title: "Ask HN: Who is hiring? (November 2018)",
        points: 65,
        author: "whoishiring",
        timeToRead: 49,
        comments: 106,
    },
];

const requestHandler = (request, response) => {
    console.log(request.url, Date.now())
    response.end(JSON.stringify(posts));
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})
