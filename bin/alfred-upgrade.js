const manager = require('../lib/manager')
const storageManager = require('../lib/storageManager')
const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .option('-v, --artVersion <artVersion>', 'the Artifactory version to upgrade to')
    .option('-d, --dir [dir]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        var dir = process.cwd()
        if (!program.artVersion) {
            console.log('Not version was specified. This is not docker and there is no default latest tag')
            return
        }
        if (!program.dir) { console.log(`No path was specified, using ${dir} by default`) }
        else if (program.dir[0] != '/') { dir += `/${program.dir}` }
        storageManager.getVersion(program.artVersion, dir)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)