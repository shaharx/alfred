const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const haManager = require('../lib/ha-manager')

program
    .version(pkg.version)
    .description('Sets an Artifactory server as HA')
    .option('-p, --path <path>', 'the upgrade Artifactory path. current working directory by default')
    .option('-o, --options <options>', 'the options for the ha-node.properties file')
    .action(() => {
        if(program.templates){
            dbManager.getTemplates()
            process.exit()
        }
        path = pathParser.parse(program.path)
        var options = {
            path: path,
            parameters: program.options
        }
        haManager.setHA(options)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)