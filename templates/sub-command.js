const program = require('commander')
const pkg = require('../package.json')
const path = require('path')

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        var path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if(path == ''){
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        path = path[0] != '/' ? `${process.cwd()}/${path}` : path
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)