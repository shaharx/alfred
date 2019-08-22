const manager = require('../../lib/manager')
const inquirer = require('inquirer')
const dbSetup = require('./../../lib/dbSetup')
const ls = require('../../lib/log-system')

function setDB(options) {
    inquirer.prompt(requirements).then(answers => {
        var dbFile =
            `type=postgresql\n` +
            `driver=org.postgresql.Driver\n` +
            `url=jdbc:postgresql://${answers.ip}:${answers.port}/${answers.database}\n` +
            `username=${answers.username}\n` +
            `password=${answers.password}\n`

        var dboptions = {
            user: answers.dbusername,
            host: answers.ip,
            port: answers.port,
            database: answers.databasename,
            password: answers.dbpassword
        }
        options.connector = `postgresql-${options.connVer}.jre6.jar`
        options.dbFile = dbFile
        options.connectorUrl = `https://jdbc.postgresql.org/download/postgresql-${options.connVer}.jre6.jar`
        options.downloadFile = `postgresql-${options.connVer}.jre6.jar`
        options.queries = [`CREATE USER ${answers.username} WITH PASSWORD '${answers.password}';`, `CREATE DATABASE ${answers.database} WITH OWNER=${answers.username} ENCODING='UTF8';`, `GRANT ALL PRIVILEGES ON DATABASE ${answers.database} TO ${answers.username};`]
        runQueries(dboptions, options.queries)
        dbSetup.setDB(options)
    })
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

var requirements = [{
    type: 'input',
    name: 'ip',
    message: `database ip:`,
    default: 'localhost'
}, {
    type: 'input',
    name: 'port',
    message: 'database port:',
    default: '5432'
}, {
    type: 'input',
    name: 'dbusername',
    message: 'database username:',
    default: 'postgres'
}, {
    type: 'input',
    name: 'databasename',
    message: 'default database name:',
    default: 'postgres'
}, {
    type: 'password',
    name: 'dbpassword',
    message: 'database password:',
    default: 'pass'
}, {
    type: 'input',
    name: 'database',
    message: 'database name:',
    default: 'artifactory'
}, {
    type: 'input',
    name: 'username',
    message: 'username:',
    default: 'artifactory'
}, {
    type: 'password',
    name: 'password',
    message: 'password:',
    default: 'password'
}]

module.exports = { setDB }