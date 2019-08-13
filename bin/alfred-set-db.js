const program = require('commander')
const pkg = require('../package.json')
const path = require('path')
const fs = require('fs')
const dbSetup = require('../lib/dbSetup')

const MYSQL = 'mysql',
    POSTGRESQL = 'postgresql',
    MSSQL = 'mssql',
    ORACLEDB = 'oracledb',
    MARIADB = 'mariadb'

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .option('-c, --connector [conn]', 'The jdbc connector version that will be downloaded according to the db type.\nA default connector version will be downloaded if no version was specified')
    .option('-t, --type <type>', `set database from one of the following types:\n\t${MYSQL}\n\t${POSTGRESQL}\n\t${MSSQL}\n\t${ORACLEDB}\n\t${MARIADB}\n`)
    .action(() => {
        if (!program.type) {
            console.error(`No database specified, please use the -t flag to do so`)
            process.exit()
        }
        var path = program.path ? program.path : require('../lib/manager').getDefaultServerPath()
        if (path == '') {
            console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
            process.exit()
        }
        path = path[0] != '/' ? `${process.cwd()}/${path}` : path
        var options = {
            type: program.type,
            path: path
        }

        switch (program.type) {
            case MYSQL:
                options.connVer = program.connector ? program.connector : '8.0.16'
                require('../misc/db/mysql').setDB(options)
                break
            case POSTGRESQL:
                require('../misc/db/POSTGRESQL').set(options)
                break
            case MSSQL:
                break
            case ORACLEDB:
                break
            case MARIADB:
                break
        }
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)