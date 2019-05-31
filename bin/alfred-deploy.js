const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-d, --dir [dir]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        var currentDirectory = !program.dir ? process.cwd() : program.dir[0] != '/' ? process.cwd()+'/'+program.dir : program.dir
        var parameters = {
            version: program.artVersion,
            dir: currentDirectory,
            state: 'deploy'
        }
        if (!program.version) {
            console.log('No version was specified. This is not docker and there is no default latest tag')
            return
        }

        storageManager.getVersion(parameters)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)