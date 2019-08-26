const program = require('commander')
const pkg = require('../package.json')
const fs = require('fs')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .option('-p, --path [path]', 'Artifactory path to manipulate the server.xml on. default server by default')
    .option('-i, --increment <number>', 'the value to increment the default port values with. 0 by default')
    .option('-a --art <art>', 'change artifactory\'s port')
    .option('-s --access <access>', 'change access\'s port')
    .option('-c --catalina <cataline>', 'change catalina\'s port')
    .action(() => {
        path = pathParser.parse(program.path)
        var xmlFile = require('../misc/server-xml').xmlFile(program.increment ? program.increment : 0)
        fs.writeFileSync(`${path}/tomcat/conf/server.xml`, xmlFile)
        ls.success('server.xml file was modified successfully')
        
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)