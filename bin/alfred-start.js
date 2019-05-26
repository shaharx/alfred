const fs = require('fs')
const { exec } = require('child_process')
const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .description('Start Artifactory in the current path')
    .action(() => {
        const execCallback = (err, stdout, stderr) => {
            if (err) { console.log('ERROR: ' + err) }
            if (stdout) { console.log('STDOUT: ' + stdout) }
            if (stderr) { console.log('STDERR: ' + stderr) }
        }

        if (!fs.existsSync('/Users/shaharl/Projects/NodeJS/alfred/tests/artifactory-pro-6.10.0/run/artifactory.pid')) {
            exec('./artifactory-pro-6.10.0/bin/artifactory.sh start', execCallback)
        } else {
            console.log('Artifactory is already running. Consider stopping it first and then try again')
        }
    })

program.parse(process.argv)