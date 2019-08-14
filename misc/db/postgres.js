const manager = require('../../lib/manager')
const inquirer = require('inquirer')
const dbSetup = require('./../../lib/dbSetup')

function setDB(options) {
    inquirer.prompt(requirements).then(answers => {
        var dbFile =
            `type=postgresql\n` +
            `driver=org.postgresql.Driver\n` +
            `url=jdbc:postgresql://${answers.ip}:${answers.port}/${answers.database}\n` +
            `username=${answers.username}\n` +
            `password=${answers.password}\n`

        options.connector = `postgresql-${options.connVer}.jre6.jar`
        options.dbFile = dbFile
        options.connectorUrl = `https://jdbc.postgresql.org/download/postgresql-${options.connVer}.jre6.jar`
        options.downloadFile = `postgresql-${options.connVer}.jre6.jar`
        dbSetup.setDB(options)
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