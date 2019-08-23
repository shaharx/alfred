const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const bsmanager = require('../lib/binarystore-manager')

program
    .version(pkg.version)
    .description('Adds or modifies a parameter in a specific provider')
    .option('-p, --path [path]', 'the path to Artifactory\'s binarystore.xml file')
    .option('-n, --providerName <provider>', 'the name/id of the provider')
    .option('-k, --parameterKey <key>', 'The parameter to add')
    .action(() => {
        var options = {
            path: pathParser.parse(program.path),
            provider: program.providerName
        }
        // bsmanager.modifyProviderParameter(options)
        console.log(program.parameterKey)
        // alfred bs mod -n s3 -k "identity=1234 credential=password" - 
        // turn this into a an array of key value and replace the variable string after stringifying the obejct
    })

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv)