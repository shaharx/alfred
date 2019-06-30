const program = require('commander')
const pkg = require('../package.json')
const path = require('path')
const fs = require('fs')

program
    .version(pkg.version)
    .option('-p, --path [dir]', 'the upgrade Artifactory path. current working directory by default')
    .option('-i, --increment <number>', 'the value to increment the default port values with. 0 by default duh')
    .action(() => {
        const path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if(path == ''){
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        var xmlFile = require('../misc/server-xml').xmlFile(program.increment ? program.increment : 0)
        // console.log(`${path}/tomcat/conf/server.xml`)
        fs.writeFileSync(`${path}/tomcat/conf/server.xml`, xmlFile)
        // var currentDirectory = !program.dir ? process.cwd() : program.dir[0] != '/' ? process.cwd() + '/' + program.dir : program.dir

    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)