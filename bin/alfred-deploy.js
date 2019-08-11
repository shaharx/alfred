const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-p, --path [path]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        // fix the deploy issue with the path undefined error
        var currentDirectory = !program.path ? process.cwd() : program.path[0] != '/' ? process.cwd()+'/'+program.path : program.path
        var parameters = {
            version: program.artVersion,
            path: currentDirectory,
            state: 'deploy'
        }
        console.log(parameters.path)
        if (!program.version) {
            console.log('No version was specified. This is not docker and there is no default latest tag')
            process.exit()
        }

        storageManager.getVersion(parameters)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)