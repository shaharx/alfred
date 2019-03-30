#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const dl = require('../lib/downloader');
const caseManager = require('../lib/caseManager');

program
    .option('-n, --new-case <caseNumber>', 'Creates a new case environment. Passing a case number as an argument is mandatory')
    .option('-v, --version <version>', 'Setup a specific version of Artifactory', 'latest')
    .action(()=>{
        manager should perform all the checks prior to continuing the case.
        caseManager.createCase(program.newCase, program.version);
    });

program.parse(process.argv);