const manager = require('../../lib/manager')
const inquirer = require('inquirer')

function set(path) {
    inquirer.prompt(requirements).then(answers => {
        var dbFile =
            `type=postgresql\n` +
            `driver=org.postgresql.Driver\n` +
            `url=jdbc:postgresql://${answers.ip}:${answers.port}/artifactory\n` +
            `username=${answers.username}\n` +
            `password=${answers.password}\n`

        manager.setDB(path, dbFile)
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
    default: '3306'
}, {
    type: 'input',
    name: 'database',
    message: 'database name:',
    default: 'artdb'
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

module.exports = { set }