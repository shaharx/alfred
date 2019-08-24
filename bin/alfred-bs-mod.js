const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const bsmanager = require('../lib/binarystore-manager')

program
    .version(pkg.version)
    .description('Adds or modifies a parameter in a specific provider')
    .option('-p, --path [path]', 'the path to Artifactory\'s binarystore.xml file')
    .option('-n, --providerName <provider>', 'the name/id of the provider')
    .option('-o, --parameters <parameters>', 'The parameter to add. -p was taken to -o is for options')
    .action(() => {
        var options = {
            path: pathParser.parse(program.path),
            provider: program.providerName,
            parameters: program.parameters
        }
        bsmanager.modifyProviderParameters(options)
    })

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv)