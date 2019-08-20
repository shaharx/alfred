const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .command('add', 'add a logger to the logback.xml file')
    .command('list', 'prints a list of all the available loggers')
    .parse(process.argv)

if(!process.argv.slice(2).length){
    //program.outputHelp();
}