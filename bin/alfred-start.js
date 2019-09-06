const fs = require('fs')
const { exec } = require('child_process')
const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .description('Start Artifactory')
    .option('-p, --path [path]', 'run the command on the current directory instead of the default server. Should be run from Artifactory home directory', '')
    .action(() => {
        path = pathParser.parse(program.path)
        const execCallback = (err, stdout, stderr) => {
            if (err) { ls.error('ERROR:\n' + err) }
            if (stdout) { ls.log('STDOUT:\n' + stdout) }
            if (stderr) { ls.error('STDERR:\n' + stderr) }
        }
        if (!fs.existsSync(`${path}/run/artifactory.pid`)) {
            exec(`${path}/bin/artifactory.sh start`, execCallback)
            ls.log('Starting Artifactory')
        } else {
            ls.log(`Artifactory is already running. Consider stopping it first and then try again\nIf you know it is not running, remove ${path}/run/artifactory.pid and try again`)
        }
    })

program.parse(process.argv)