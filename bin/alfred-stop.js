const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const im = require('../lib/instanceManager')
const sh = require('shelljs')
const find = require('find-process')

program
    .version(pkg.version)
    .description('Stop Artifactory')
    .option('-p, --path [path]', 'run the command on the current directory instead of the default server. Should be run from Artifactory home directory', '')
    .action(async () => {
        path = pathParser.parse(program.path)
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