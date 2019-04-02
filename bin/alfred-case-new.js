const program = require('commander');
const pkg = require('../package.json');
const dl = require('../lib/downloader');

program
    .option('-n, --number <number>', 'the number or name of a case environment')
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-d, --description <description>', 'case issue description. should be wrapped in quotations')
    .action(() => {
        console.log(program.number)
    });

program.parse(process.argv);