const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-d, --dir [dir]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)