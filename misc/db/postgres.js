const manager = require('../../lib/manager')
const inquirer = require('inquirer')
const dbSetup = require('../../lib/database-manager')
const ls = require('../../lib/log-system')

function setDB(options) {
    var parameters = {}
    if (options.useDefaults) {
        parameters = defaultParameters
    } else if (options.parameters) {
        parameters = options.parameters
    } else {
        ls.error(`No options were specified. use the --useDefaults flag to use the following default values: ${defaultParameters}`)
    }
    var dbFile =
        `type=postgresql\n` +
        `driver=org.postgresql.Driver\n` +
        `url=jdbc:postgresql://${parameters.host}:${parameters.port}/${parameters.art_dbname}\n` +
        `username=${parameters.artifactory_db_username}\n` +
        `password=${parameters.artifactory_db_password}\n`

    var dboptions = {
        host: parameters.host,
        port: parameters.port,
        user: parameters.psql_username,
        database: parameters.psql_database,
        password: parameters.psql_password
    }
    options.connector = `postgresql-${options.connVer}.jre6.jar`
    options.dbFile = dbFile
    options.connectorUrl = `https://jdbc.postgresql.org/download/postgresql-${options.connVer}.jre6.jar`
    options.downloadFile = `postgresql-${options.connVer}.jre6.jar`
    options.queries = [`CREATE USER ${parameters.artifactory_db_username} WITH PASSWORD '${parameters.artifactory_db_password}';`, `CREATE DATABASE ${parameters.art_dbname} WITH OWNER=${parameters.artifactory_db_username} ENCODING='UTF8';`, `GRANT ALL PRIVILEGES ON DATABASE ${parameters.art_dbname} TO ${parameters.artifactory_db_username};`]

    if (options.skipQuery) { ls.warn('Skipped running queries in the database') }
    else { runQueries(dboptions, options.queries) }

    if (options.skipSettings) { ls.warn('Skipped the database in Artifactory') }
    else { dbSetup.setDB(options) }
}

function runQueries(dboptions, queries) {
    const { Client } = require('pg')
    const client = new Client(dboptions)
    client.connect()

    client.query(queries[0], (err, res) => {
        client.query(queries[1], (err, res) => {
            client.query(queries[2], (err, res) => {
                err ? ls.error(err) : ls.success(`succesfully ran ${queries[2]}`)
                client.end()
            })
            err ? ls.error(err) : ls.success(`succesfully ran ${queries[1]}`)
        })
        err ? ls.error(err) : ls.success(`succesfully ran ${queries[0]}`)
    })
}

var defaultParameters = {
    host: 'localhost',
    port: '5432',
    psql_username: 'postgres',
    psql_database: 'postgres',
    psql_password: 'pass',
    art_dbname: 'artifactory',
    artifactory_db_username: 'artifactory',
    artifactory_db_password: 'password'
}

module.exports = { setDB }