const program = require('commander')
const pkg = require('../package.json')
const fs = require('fs')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .option('-p, --path [dir]', 'the upgrade Artifactory path. default server by default')
    .option('-i, --increment <number>', 'the value to increment the default port values with. 0 by default duh')
    .action(() => {
        path = pathParser.parse(program.path)
        var xmlFile = require('../misc/server-xml').xmlFile(program.increment ? program.increment : 0)
        fs.writeFileSync(`${path}/tomcat/conf/server.xml`, xmlFile)
        ls.success('server.xml file was modified successfully')
        // var currentDirectory = !program.dir ? process.cwd() : program.dir[0] != '/' ? process.cwd() + '/' + program.dir : program.dir

    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)