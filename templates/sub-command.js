// when copying this file, do not forget to update the requires path

const program = require('commander')
const pkg = require('../package.json')
const path = require('path')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the path to deploy Artifactory to. current working directory by default')
    .action(() => {
        path = pathParser.parse(program.path)
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)