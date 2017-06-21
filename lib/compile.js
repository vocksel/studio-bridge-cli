const fs = require('fs');
const path = require('path');

const isDirectory = require('./fileHelpers').isDirectory;
const getProperties = require('./getProperties');

// Gets children and converts them to their appropriate Object.
//
// This is the primary interface to constructing the Object hierarchy. When
// supplied with a folder, it will recursively gather all of that folder's
// children, converting them to their appropriate Object.
//
// When supplied with a file, this just works like getObjectFromFile() or
// newScript().
function compile(filePath) {
  const children = [];

  for (const child of fs.readdirSync(filePath)) {
    const childPath = path.join(filePath, child);
    const object = getProperties(childPath);

    if (object) {
      if (isDirectory(childPath)) {
        object.Children = compile(childPath);
      }

      children.push(object);
    };
  };

  return children;
}

module.exports = compile;
