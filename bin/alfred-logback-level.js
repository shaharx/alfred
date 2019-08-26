const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const lbmanager = require('../lib/logback-manager')

program
    .version(pkg.version)
    .description('Change a log level of a specific logger')
    .option('-p, --path [path]', 'the path to deploy Artifactory to. current working directory by default')
    .option('-n, --name <logger_name>', 'The logger to change level')
    .option('-l, --level <level>', 'The logger to change level')
    .action(() => {
        path = pathParser.parse(program.path)
        var options = {
            path: path,
            loggerName: program.name,
            level: program.level
        }
        newPath = pathParser.parse(program.path)
        lbmanager.changeLogLevel(options)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)