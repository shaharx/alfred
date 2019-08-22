const program = require('commander')
const pkg = require('../package.json')
const manager = require('../lib/manager')
const dl = require('../lib/downloader')

program
    .version(pkg.version)
    .action(() => {
        dl.download(manager.getDirectories().logback)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)