// Contains helper functions related to the filesystem.

const fs = require('fs');
const path = require('path');

exports.isDirectory = function(filePath) {
  return fs.statSync(filePath).isDirectory();
}

exports.getFileContents = function(filePath) {
  return fs.readFileSync(filePath, {
    // UTF-8 encoding so that we get a string instead of bytes.
    encoding: 'utf-8'
  });
}
