const fs = require('fs')
const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to upgrade to')
    .option('-d, --dir [dir]', 'the upgrade Artifactory path. current working directory by default')
    .action(() => {
        var currentDirectory = !program.dir ? process.cwd() : program.dir[0] != '/' ? process.cwd() + '/' + program.dir : program.dir
        var parameters = {
            version: program.artVersion,
            dir: currentDirectory,
            state: 'upgrade'
        }
        console.log('--------' + parameters.dir)

        var currentVersion = manager.getInstanceMetadata(parameters.dir)

        console.log(currentVersion)

        const versionChecker = require('../lib/versionCheck')
        if (!program.version) {
            console.log('No version was specified. This is not docker and there is no default latest tag')
            return
        } else if (!versionChecker.checkVersion(manager.getInstanceMetadata(parameters.dir).version, parameters.version, 'upgrade')) {
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