const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')

const MYSQL = 'mysql',
    POSTGRESQL = 'postgresql',
    MSSQL = 'mssql',
    ORACLEDB = 'oracledb',
    MARIADB = 'mariadb'

program
    .version(pkg.version)
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .option('-c, --connectorVersion [conn]', 'The jdbc connector version that will be downloaded according to the db type.\nA default connector version will be downloaded if no version was specified')
    .option('-t, --type <type>', `set database from one of the following types:\n\t${MYSQL}\n\t${POSTGRESQL}\n\t${MSSQL}\n\t${ORACLEDB}\n\t${MARIADB}\n`)
    .action(() => {
        if (!program.type) {
            ls.error(`No database specified, please use the -t flag to do so`)
            process.exit()
        }
        path = pathParser.parse(program.path)
        var options = {
            type: program.type,
            path: path
        }

        switch (program.type) {
            case MYSQL:
                options.connVer = program.connectorVersion ? program.connectorVersion : '8.0.16'
                require('../misc/db/mysql').setDB(options)
                break
            case POSTGRESQL:
                options.connVer = program.connectorVersion ? program.connectorVersion : '9.4.1212'
                require('../misc/db/postgres').setDB(options)
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