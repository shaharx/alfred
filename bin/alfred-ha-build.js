const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const haManager = require('../lib/ha-manager')
const sh = require('shelljs')

program
    .version(pkg.version)
    .description('Build basic two node artifactory cluster on port 8091 and 8092 respectively and postgresql database. Docker engine running is required.\nThe template used is a shell script available to customize with pre-ready commands for binary store and database templates aswell.\nRun alfred templates --haBuild to get it.')
    .option('-v, --artVersion <artVersion>', 'The Artifactory cluster version to deploy')
    .action(async () => {
        path = pathParser.parse(program.path)
        var script = haManager.getTemplate()
        if (program.artVersion) {
            script = script.replace('6.11.6', program.artVersion)
        }
        sh.exec(script)
    
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)