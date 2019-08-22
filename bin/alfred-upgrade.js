const fs = require('fs')
const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to upgrade to')
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .action(() => {
        path = pathParser.parse(program.path)
        var parameters = {
            version: program.artVersion,
            path: path,
            state: 'upgrade'
        }

        var currentVersion = manager.getInstanceMetadata(parameters.path)

        const versionChecker = require('../lib/versionCheck')
        if (!program.version) {
            ls.error('No version was specified. This is not docker and there is no default latest tag')
            return
        } else if (!versionChecker.checkVersion(manager.getInstanceMetadata(parameters.path).version, parameters.version, 'upgrade')) {
            ls.error('Cannot upgrade to an earlier or similar version')
        } else {
            ls.success('Version is valid, upgrading...')
            storageManager.getVersion(parameters)
        }
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)