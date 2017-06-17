const fs = require('fs');
const path = require('path');

const fileHelpers = require('./file-helpers');
const isDirectory = fileHelpers.isDirectory;
const getFileContents = fileHelpers.getFileContents;

// Allows you to use short words for Roblox Script classes.
//
// Adding '.module' or '.local' between a Lua file's name and extension defines
// it as a ModuleScript or LocalScript, respectively.
//
// word : str
//  This can either be 'module' for ModuleScript, 'local' for LocalScript, or
//  nothing for a plain Script.
function getClassNameFromKeyword(word) {
  if (word === 'module') {
    return 'ModuleScript';
  } else if (word === 'local') {
    return 'LocalScript';
  } else if (word === 'script') {
    return 'Script';
  } else {
    return null;
  }
}

function getName(filePath) {
  const base = path.basename(filePath);
  const parts = base.split('.');
  return parts[0];
}

function getClassKeyword(filePath) {
  const base = path.basename(filePath);
  const keyword = base.split('.').slice(-2, -1)[0];

  if (keyword != getName(filePath)) {
    return keyword;
  } else {
    return 'script';
  }
}

function getClassName(filePath) {
  const keyword = getClassKeyword(filePath);
  return getClassNameFromKeyword(keyword);
}

// Gets properties of a folder.
//
// Usage:
//
//   getFolderProperties('./Folder/')
//   { Name: 'Folder', ClassName: 'Folder', Children: [ Object... ] }
function getFolderProperties(filePath) {
  const name = path.basename(filePath);

  return {
    Name: name,
    ClassName: 'Folder',
    Children: constructHierarchy(filePath)
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
  const name = path.basename(filePath, '.json');
  const properties = JSON.parse(getFileContents(filePath));

  properties.Name = name;

  if (!properties.ClassName) {
    console.error('Could not sync ' + filePath + ' (missing ClassName property)');
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
function getProperties(filePath) {
  if (isDirectory(filePath)) {
    return getFolderProperties(filePath);
  } else {
    return getFileProperties(filePath);
  };
}

// Gets children and converts them to their appropriate Object.
//
// This is the primary interface to constructing the Object hierarchy. When
// supplied with a folder, it will recursively gather all of that folder's
// children, converting them to their appropriate Object.
//
// When supplied with a file, this just works like getObjectFromFile() or
// newScript().
function constructHierarchy(filePath) {
  const children = [];

  for (const child of fs.readdirSync(filePath)) {
    const childPath = path.join(filePath, child);
    const object = getProperties(childPath);

    if (object) {
      children.push(object);
    };
  };

  return children;
}

module.exports = constructHierarchy
