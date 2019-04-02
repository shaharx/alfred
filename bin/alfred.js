#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .command('case', 'case management module')
    .parse(process.argv);

if(!process.argv.slice(2).length){
    //program.outputHelp();
}