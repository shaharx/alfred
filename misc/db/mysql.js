const manager = require('../../lib/manager')
const inquirer = require('inquirer')

function set(path) {
    inquirer.prompt(requirements).then(answers => {
        var dbFile =
            `type=mysql\n` +
            `driver=com.mysql.jdbc.Driver\n` +
            `url=jdbc:mysql://${answers.ip}:${answers.port}/${answers.database}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false\n` +
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