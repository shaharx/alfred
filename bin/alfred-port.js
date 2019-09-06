const program = require('commander')
const pkg = require('../package.json')
const fs = require('fs')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const im = require('../lib/instanceManager')
const pm = require('../lib/port-manager')

program
    .version(pkg.version)
    .option('-p, --path [path]', 'Artifactory path to manipulate the server.xml on. default server by default')
    .option('-o, --options <parameters>', 'the port numbers to change in the following format "8081:8082 8040:8041"')
    .action(() => {
        path = pathParser.parse(program.path)
        const options = {
            path: path,
            parameters: program.options
        }
        pm.setPort(options)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)