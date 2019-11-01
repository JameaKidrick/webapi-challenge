console.log('=== RUNNING ===');

const server = require('./server');

server.listen(8000, () => {
  console.log('\n=== SERVER LISTENING TO PORT 8000 ===\n')
})