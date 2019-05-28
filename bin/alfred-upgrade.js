const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to upgrade to')
    .option('-d, --dir [dir]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)