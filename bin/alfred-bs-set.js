const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const bsmanager = require('../lib/binarystore-manager')

program
    .version(pkg.version)
    .description('Set a chain template and a provider (optional) in the binarystore.xml file')
    .option('-p, --path [path]', 'the path to Artifactory\'s binarystore.xml file')
    .option('-v, --configVersion <version>', 'the configuration version')
    .option('-t, --template <template>', 'the name of the template')
    .option('-n, --providerName <provider>', 'the name/id of the provider. Should have been -p but it\'s taken by path')
    .action(() => {
        var options = {
            path: pathParser.parse(program.path),
            configVersion: program.configVersion,
            template: program.template,
            provider: program.providerName
        }
        bsmanager.addChainTemplate(options)
    })

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv)