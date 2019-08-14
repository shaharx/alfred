const fs = require('fs')
const { exec } = require('child_process')
const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .description('Start Artifactory')
    .option('-p, --path [path]', 'run the command on the current directory instead of the default server. Should be run from Artifactory home directory', '')
    .action(() => {
        var path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if(path == ''){
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        path = path[0] != '/' ? `${process.cwd()}/${path}` : path
        const execCallback = (err, stdout, stderr) => {
            if (err) { console.log('ERROR:\n' + err) }
            if (stdout) { console.log('STDOUT:\n' + stdout) }
            if (stderr) { console.log('STDERR:\n' + stderr) }
        }
        if (!fs.existsSync(`${path}/run/artifactory.pid`)) {
            exec(`${path}/bin/artifactory.sh start`, execCallback)
            console.log('Started successfully')
        } else {
            console.log(`Artifactory is already running. Consider stopping it first and then try again\nIf you know it is not running, remove ${path}run/artifactory.pid and try again`)
        }
    })

program.parse(process.argv)