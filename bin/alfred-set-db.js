const program = require('commander')
const pkg = require('../package.json')
const path = require('path')
const fs = require('fs')

const dbs = ['mysql', 'mssql', 'postgres', 'oracledb', 'mariadb']

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .option('-t, --type <type>', `set database from one of the following types:\n\t${dbs[0]}\n\t${dbs[1]}\n\t${dbs[2]}\n\t${dbs[3]}\n\t${dbs[4]}\n`)
    .action(() => {
        var path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if (path == '') {
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        path = path[0] != '/' ? `${process.cwd()}/${path}` : path
        if (!program.type) { console.error(`No database specified, please use the -t flag to do so`) }

        switch (program.type) {
            case dbs[0]:
                require('../misc/db/mysql').set(path)
                break
            case dbs[0]:
                break
            case dbs[0]:
                break
            case dbs[0]:
                break
            case dbs[0]:
                break
        }

        console.log()


    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)