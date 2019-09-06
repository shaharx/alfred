const dbSetup = require('../../lib/database-manager')
const ls = require('../../lib/log-system')
var dockerCLI = require('docker-cli-js')
var Docker = dockerCLI.Docker

function setDB(options) {
    var parameters = options.parameters ? options.parameters : defaultParameters

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

    if (options.new) {
        var docker = new Docker();
        var image = options.image ? options.image : 'postgres'

        var dockerCommand = `run --name alfred_psql -p ${dboptions.port}:5432 -e POSTGRES_PASSWORD=${dboptions.password} -d ${image}`
        docker.command(dockerCommand)
            .then(function (data) {
                var interval = setInterval(() => {
                    runQueries(dboptions, options.queries, interval)
                }, 2000)
            })
    }
    else if (options.skipQuery) { ls.warn('Skipped running queries in the database') }
    else { runQueries(dboptions, options.queries, false) }

    if (options.skipSettings) { ls.warn('Skipped the database in Artifactory') }
    else { dbSetup.setDB(options) }
}

function runQueries(dboptions, queries, interval) {
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
        if (!err) {
            if (interval) { clearInterval(interval) }
            ls.success(`succesfully ran ${queries[0]}`)
        } else { ls.error(err) }
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


// {"host":"localhost","port":"3306","user":"root","password":"password"}
// {"host":"localhost","port":"3306","user":"root","password":"password"}