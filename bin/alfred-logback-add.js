const program = require('commander')
const pkg = require('../package.json')
// const path = require('path')
const pathParser = require('../lib/pathParser')
const lbmanager = require('../lib/logback-manager')

program
    .version(pkg.version)
    .option('-n, --name <logger_name>', 'the Artifactory version to deploy')
    .option('-p, --path [path]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        newPath = pathParser.parse(program.path)
        lbmanager.addLogger(newPath, program.name)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)