const fs = require('fs')
const { exec } = require('child_process')
const program = require('commander')
const manager = require('../lib/manager')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .description('Set basic configurations')
    .option('-d, --default <path>', 'set default server')
    .action(() => {
        defaultPath = pathParser.parse(program.default)
        if(program.default){
            defaultPath = pathParser.parse(program.default)
            manager.setDefaultServerPath(defaultPath)
        }
    })

program.parse(process.argv)