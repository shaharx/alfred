const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const im = require('../lib/instanceManager')
const sh = require('shelljs')
const find = require('find-process')

program
    .version(pkg.version)
    .description('Start Artifactory, unlike other commands, start and stop do not need a -p flag but only the path to artifactory home')
    .arguments('[path]')
    .action(async (path) => {
        path = pathParser.parse(path)
        var start = true
        var processes = await find('name', 'java')
        processes.forEach(proc => {
            if (proc.cmd.includes(`-Dartifactory.home=${path}`)) {
                ls.warn(`${path} is already running on procces ${proc.pid}`)
                start = false
            }
        })
        if (start) { sh.exec(path + im.getPath().art_sh + ' start') }
    })

program.parse(process.argv)