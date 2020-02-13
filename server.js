const express = require('express');

const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());
server.use('/api/users', logger, userRouter);

// routes
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  var queryDate = new Date().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`${req.method} request to ${req.originalUrl} at ${queryDate}`);
  next();
}

module.exports = server;
