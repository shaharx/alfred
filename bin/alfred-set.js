const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .command('port', 'set a new port, choose a value to increment the default values with')
    .command('db', 'set database')
    .parse(process.argv)

if(!process.argv.slice(2).length){
    //program.outputHelp();
}