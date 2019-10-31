const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const lbmanager = require('../lib/logback-manager')

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the path to the logback.xml')
    .option('-n, --name <logger_name>', 'the name of the logger to add')
    .option('-l, --level <level>', 'set log level')
    .option('-a, --appenderName <appender>', 'the name of the appender to write the log to')
    .action(() => {
        newPath = pathParser.parse(program.path)
        var options = {
            path: newPath,
            name: program.name,
            level: program.level,
            appenderName: program.appenderName
        }
        lbmanager.addLogger(options)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)