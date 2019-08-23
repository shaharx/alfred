const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .description('Mange the binary store')
    .command('set', 'set a binary provider')
    .command('list', 'prints a list of all the available providers and parameters')
    .command('mod', 'modify binary provider parameters')
    .parse(process.argv)

if(!process.argv.slice(2).length){
    //program.outputHelp();
}