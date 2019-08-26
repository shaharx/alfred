const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const ls = require('../lib/log-system')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to deploy')
    .option('-p, --path [path]', 'the path to deploy Artifactory to')
    .option('-d, --default', 'set the new Artifactory as the default server')
    .option('-l, --license <license_name>', 'Add a license from the license directory at ALFRED_HOME')
    .action(() => {
        if (!program.artVersion) {
            ls.error('No version specified, please specify using the -v <x.x.x> flag')
        }
        var newPath = !program.path ? process.cwd() : program.path[0] != '/' ? process.cwd() + '/' + program.path : program.path
        newPath = newPath[newPath.length - 1] != '/' ? newPath : newPath.substring(0, newPath.length - 1)
        var parameters = {
            version: program.artVersion,
            path: newPath,
            state: 'deploy'
        }
        if (program.default) { parameters.default = true }
        if (program.license) { parameters.license = program.license }
        if (!program.version) {
            ls.error('No version was specified. This is not docker and there is no default latest tag')
            process.exit()
        }
        storageManager.getVersion(parameters)
    })

if (!process.argv.slice(2).length) {
    // program.outputHelp();
}

program.parse(process.argv)