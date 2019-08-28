const manager = require('../../lib/manager')
const inquirer = require('inquirer')
const dbSetup = require('./../../lib/dbSetup')
const ls = require('../../lib/log-system')

function setDB(options) {
    var parameters = {
        host: 'localhost',
        port: '5432',
        psql_username: 'postgres',
        psql_database: 'postgres',
        psql_password: 'pass',
        art_dbname: 'artifactory',
        art_username: 'artifactory',
        art_password: 'password'
    }

    var dbFile =
        `type=postgresql\n` +
        `driver=org.postgresql.Driver\n` +
        `url=jdbc:postgresql://${parameters.host}:${parameters.port}/${parameters.art_dbname}\n` +
        `username=${parameters.art_username}\n` +
        `password=${parameters.art_password}\n`

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
    options.queries = [`CREATE USER ${parameters.art_username} WITH PASSWORD '${parameters.art_password}';`, `CREATE DATABASE ${parameters.art_dbname} WITH OWNER=${parameters.art_username} ENCODING='UTF8';`, `GRANT ALL PRIVILEGES ON DATABASE ${parameters.art_dbname} TO ${parameters.art_username};`]
    
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

module.exports = { setDB }