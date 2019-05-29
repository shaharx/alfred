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
        var parameters = {
            version: program.artVersion,
            dir: process.cwd(),
            state: 'deploy'
        }
        if (!program.version) {
            console.log('Not version was specified. This is not docker and there is no default latest tag')
            return
        }
        if (!parameters.dir) { console.log(`No path was specified, using ${parameters.dir} by default`) }
        else if (parameters.dir[0] != '/') { parameters.dir += `/${program.dir}` }

        storageManager.getVersion(parameters)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)