const program = require('commander')
const pkg = require('../package.json')
// const path = require('path')
const pathParser = require('../lib/pathParser')
const lbmanager = require('../lib/logback-manager')

program
    .version(pkg.version)
    .action(() => {
        lbmanager.list()
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)