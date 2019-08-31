const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .description('Manage Artifactory HA configurations')
    .command('set', 'set an artifactory server as HA')
    .parse(process.argv)

if(!process.argv.slice(2).length){
    //program.outputHelp();
}