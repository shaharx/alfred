const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .command('new', 'Create a new case')
    .command('update', 'Update a case')
    .parse(process.argv);

if(!process.argv.slice(2).length){
    //program.outputHelp();
}