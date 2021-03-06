const http = require('http');
const chokidar = require('chokidar');

const compile = require('./compile');

module.exports = function startServer(dir, port) {
  console.log(`Server started on http://localhost:${port}`)
  console.log(`Using: ${dir}`)

  let objects = compile(dir);

  // Rebuilds the hierarchy each time a file is changed.
  // Previously we would build the hierarchy each GET request.
  chokidar.watch(dir).on('all', (evt, path) => {
    // 'change' for when a file is modified.
    // 'unlink' for when a file is removed or renamed.
    if (evt === 'change' || evt === 'unlink') {
      objects = compile(dir);
    }
  });

  http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(objects, null, 1));
  }).listen(port);
}
