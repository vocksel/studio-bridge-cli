#! /usr/bin/env node

const path = require('path');
const fs = require('fs');

const program = require('commander');

const pkg = require('../package.json');
const server = require('../lib/server.js');

// The port to run the server off of.
//
// This is hard-coded as there is currently no way to change the port that the
// plugin listens on. Allowing the user to change the port the server uses will
// leave the plugin unable to communicate.
const PORT = 8080

function failWithHelp(msg) {
  console.log(msg);
  program.help();
  process.exit(1);
}

program
  .version(pkg.version)
  .arguments('<dir>')
  .action(dir => {
    const fullPath = path.resolve(dir);

    if (fs.existsSync(fullPath)) {
      server(fullPath, PORT);
    } else {
      failWithHelp(`Could not find a directory at ${fullPath}`)
    }
  });

program.parse(process.argv);

if (!program.args[0])
  failWithHelp('The directory argument is required.');
