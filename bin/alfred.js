#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .command('deploy', 'deploy Artifactory')
    .command('upgrade', 'upgrade Artifactory')
    .command('start', 'start Artifactory')
    .command('stop', 'stop Artifactory')
    .command('case', 'case management module - Not funtional yet')
    .parse(process.argv)

if(!process.argv.slice(2).length){
    //program.outputHelp();
}