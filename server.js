const express = require('express');
const server = express();

const actionRouter = require('./data/helpers/actionRouter');
const projectRouter = require('./data/helpers/projectRouter');

server.get('/', (req, res) => {
  res.send(`<h1>HELLO WORLD</h1>`)
})

server.use(express.json())
server.use('/api/actions', actionRouter);
server.use('/api/projects', projectRouter);

module.exports = server;