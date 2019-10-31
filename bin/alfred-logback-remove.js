const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const lbmanager = require('../lib/logback-manager')

program
    .version(pkg.version)
    .description('Remove a logger from the logaback.xml file')
    .option('-p, --path [path]', 'the path to the logback.xml file')
    .option('-n, --name <logger_name>', 'the logger name to remove')
    .action(() => {
        newPath = pathParser.parse(program.path)
        var options = {
            path: newPath,
            name: program.name
        }
        lbmanager.removeLogger(options)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)