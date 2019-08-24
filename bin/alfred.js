#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .description('This is fantastic, you don\'t get it.')
    .command('set', 'configure basic configuration')
    .command('deploy', 'deploy Artifactory')
    .command('upgrade', 'upgrade Artifactory')
    .command('start', 'start Artifactory')
    .command('stop', 'stop Artifactory')
    .command('case', 'case management module - Not funtional yet')
    .command('db', 'change Artifactory configurations')
    .command('logback', 'change Artifactory logback configurations')
    .command('bs', 'change Artifactory configurations')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}