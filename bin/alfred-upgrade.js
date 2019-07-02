const fs = require('fs')
const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to upgrade to')
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .action(() => {
        var path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if(path == ''){
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        path = path[0] != '/' ? `${process.cwd()}/${path}` : path
        var parameters = {
            version: program.artVersion,
            path: currentDirectory,
            state: 'upgrade'
        }

        var currentVersion = manager.getInstanceMetadata(parameters.path)

        const versionChecker = require('../lib/versionCheck')
        if (!program.version) {
            console.log('No version was specified. This is not docker and there is no default latest tag')
            return
        } else if (!versionChecker.checkVersion(manager.getInstanceMetadata(parameters.path).version, parameters.version, 'upgrade')) {
            console.log('Cannot upgrade to an earlier or similar version')
        } else {
            console.log('Version is valid, upgrading...')
            storageManager.getVersion(parameters)
        }
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)