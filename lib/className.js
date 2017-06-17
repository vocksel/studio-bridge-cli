const path = require('path');

const fileHelpers = require('./fileHelpers');
const getName = fileHelpers.getName;

// Allows you to use short words for Roblox Script classes.
//
// Adding '.module' or '.local' between a Lua file's name and extension defines
// it as a ModuleScript or LocalScript, respectively.
//
// word : str
//  This can either be 'module' for ModuleScript, 'local' for LocalScript, or
//  nothing for a plain Script.
exports.getClassNameFromKeyword = function(word) {
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

exports.getClassKeyword = function(filePath) {
  const base = path.basename(filePath);
  const keyword = base.split('.').slice(-2, -1)[0];

  if (keyword != getName(filePath)) {
    return keyword;
  } else {
    return 'script';
  }
}

exports.getClassName = function(filePath) {
  const keyword = exports.getClassKeyword(filePath);
  return exports.getClassNameFromKeyword(keyword);
}
