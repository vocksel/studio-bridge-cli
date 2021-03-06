const path = require('path');

const fileHelpers = require('./fileHelpers');
const isDirectory = fileHelpers.isDirectory;
const getFileContents = fileHelpers.getFileContents;
const getName = fileHelpers.getName;

const className = require('./className');
const getClassName = className.getClassName;

// Gets properties of a folder.
//
// Usage:
//
//   getFolderProperties('./Folder/')
//   { Name: 'Folder', ClassName: 'Folder', Children: [ Object... ] }
function getFolderProperties(filePath) {
  return {
    Name: getName(filePath),
    ClassName: 'Folder'
  };
}

// Gets properties of a Lua script.
//
// The `ClassName` property varies based on the class identifier (the part after
// the filename). You can see how this works below.
//
// Usage:
//
//   getLuaFileProperties('Server.lua');
//   { Name: 'Server', ClassName: 'Script', Source: '...'}
//
//   getLuaFileProperties('Client.local.lua');
//   { Name: 'Client', ClassName: 'LocalScript', Source: '...'}
//
//   getLuaFileProperties('Helper.module.lua');
//   { Name: 'Helper', ClassName: 'ModuleScript', Source: '...'}
function getLuaFileProperties(filePath) {
  return {
    Name: getName(filePath),
    ClassName: getClassName(filePath),
    Source: getFileContents(filePath)
  };
}

// Gets properties for other instances using JSON.
//
// This function allows you to create just about any Roblox instance using JSON
// files. Simply add in-game properties of the instance you're creating and
// they'll appear in-game.
//
// Requirements:
//
// - All properties need to be written in UpperCamelCase.
// - A ClassName property needs to be defined. This lets us know which instance
//   to create.
//
// Usage:
//
//   getJsonFileProperties('/path/to/file.json')
function getJsonFileProperties(filePath) {
  const properties = JSON.parse(getFileContents(filePath));

  properties.Name = getName(filePath);

  if (!properties.ClassName) {
    console.error('Could not sync ' + filePath + ' (missing ClassName property)');
    return null;
  };

  return properties;
}

// Simply routes files to the appropriate function for retrieveing properties.
function getFileProperties(filePath) {
  const ext = path.extname(filePath);

  if (ext === '.lua') {
    return getLuaFileProperties(filePath);
  } else if (ext === '.json') {
    return getJsonFileProperties(filePath);
  };
}

// Gets the Roblox properties of a file or folder.
//
// The returned object's keys are in UpperCamelCase, matching Roblox's naming
// convention. This makes it easy to work with the properties when the object is
// passed off to the plugin.
//
// Usage:
//
//   getProperties('./path/to/folder/');
//   { Name: 'folder', ClassName: 'Folder', Children: [ [Object]... ] }
//
//   getProperties('./path/to/file.local.lua');
//   { Name: 'file', ClassName: 'LocalScript', Source: '...'}
module.exports = function getProperties(filePath) {
  if (isDirectory(filePath)) {
    return getFolderProperties(filePath);
  } else {
    return getFileProperties(filePath);
  };
}
