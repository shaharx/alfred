const program = require('commander')
const pkg = require('../package.json')
const pathParser = require('../lib/pathParser')
const propsManager = require('../lib/props-manager')

program
    .version(pkg.version)
    .description('Manage the artifactory.system.properties file')
    .option('-a, --add <key=value>', 'adds system propery')
    .option('-r, --remove <key>', 'removes a system propery')
    .action(() => {
        newPath = pathParser.parse(program.path)
        if(program.add){
            const options = {
                path: newPath,
                parameter: program.add
            }
            propsManager.add(options)
        }
        if(program.remove){
            const options = {
                path: newPath,
                parameter: program.remove
            }
            propsManager.remove(options)
        }
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)