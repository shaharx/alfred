const fs = require('fs')
const { exec } = require('child_process')
const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .description('Stop Artifactory in the current path')
    .action(() => {
        const execCallback = (err, stdout, stderr) => {
            if (err) { console.log('ERROR: ' + err) }
            if (stdout) { console.log('STDOUT: ' + stdout) }
            if (stderr) { console.log('STDERR: ' + stderr) }
        }

        if (fs.existsSync('/Users/shaharl/Projects/NodeJS/alfred/tests/artifactory-pro-6.10.0/run/artifactory.pid')) {
            exec('./artifactory-pro-6.10.0/bin/artifactory.sh stop', execCallback)
        } else {
            console.log('Artifactory is not running. Consider starting it first and then try again')
        }
    })

program.parse(process.argv)