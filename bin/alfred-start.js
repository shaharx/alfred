const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const im = require('../lib/instanceManager')
const sh = require('shelljs')
const find = require('find-process')

program
    .version(pkg.version)
    .description('Start Artifactory')
    .option('-p, --path [path]', 'run the command on the current directory instead of the default server. Should be run from Artifactory home directory', '')
    .action(async () => {
        path = pathParser.parse(program.path)
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