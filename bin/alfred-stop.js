const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const im = require('../lib/instanceManager')
const sh = require('shelljs')
const find = require('find-process')

program
    .version(pkg.version)
    .description('Stop Artifactory, unlike other commands, start and stop do not need a -p flag but only the path to artifactory home')
    .arguments('[path]')
    .action(async (path) => {
        path = pathParser.parse(path)
        var processes = await find('name', 'java')
        var stop = false
        processes.forEach(proc => {
            if (proc.cmd.includes(`-Dartifactory.home=${path}`)) {
                sh.exec(path + im.getPath().art_sh + ' stop')
                stop = true
            }
        })
        if(!stop){ls.warn(`${path} is not running`)}
    })

program.parse(process.argv)