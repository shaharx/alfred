const program = require('commander')
const pkg = require('../package.json')
const ls = require('../lib/log-system')
const pathParser = require('../lib/pathParser')
const dbManager = require('../lib/database-manager')

const MYSQL = 'mysql',
    POSTGRESQL = 'postgresql',
    MSSQL = 'mssql',
    ORACLEDB = 'oracledb',
    MARIADB = 'mariadb'

program
    .version(pkg.version)
    .description('Sets a database along with the jdbc connector and the queries required to run before connecting')
    .option('-p, --path [path]', 'the upgrade Artifactory path. current working directory by default')
    .option('-c, --connectorVersion [conn]', 'The jdbc connector version that will be downloaded according to the db type.\nA default connector version will be downloaded if no version was specified')
    .option('-o, --parameters <parameters>', 'The parameter to add in a JSON format')
    .option('--skipQuery', 'skip running the queries in the database')
    .option('--skipSettings', 'skips setting the database in artifactory')
    .option('--templates', 'show templates for databases parameters, cancels all other flags')
    .option('--userDefaults')
    .option('-t, --type <type>', `set database from one of the following types:\n\t${MYSQL}\n\t${POSTGRESQL}\n\t${MSSQL}\n\t${ORACLEDB}\n\t${MARIADB}\n`)
    .action(() => {
        if(program.templates){
            dbManager.getTemplates()
            process.exit()
        }
        if (!program.type) {
            ls.error(`No database specified, please use the -t flag to do so`)
            process.exit()
        }
        path = pathParser.parse(program.path)
        var options = {
            type: program.type,
            path: path
        }
        program.parameters ? options.parameters = JSON.parse(program.parameters) : ''
        program.skipSettings ? options.skipSettings = true : ''
        program.skipQuery ? options.skipQuery = true : ''
        program.useDefaults ? options.useDefaults = true : ''

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
                ls.warn(`${program.type} is not functional yet`)
                break
            case ORACLEDB:
                ls.warn(`${program.type} is not functional yet`)
                break
            case MARIADB:
                ls.warn(`${program.type} is not functional yet`)
                break
        }
    })

if (!process.argv.slice(2).length) {
    //program.outputHelp();
}

program.parse(process.argv)