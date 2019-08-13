const inquirer = require('inquirer')
const dbSetup = require('../../lib/dbSetup')

function setDB(options) {
    inquirer.prompt(requirements).then(answers => {
        dbFile =
            `type=mysql\n` +
            `driver=com.mysql.jdbc.Driver\n` +
            `url=jdbc:mysql://${answers.ip}:${answers.port}/${answers.database}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false\n` +
            `username=${answers.username}\n` +
            `password=${answers.password}\n`

        options.connector = `mysql-connector-java-${options.connVer}.jar`
        options.dbFile = dbFile
        options.connectorUrl = `http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${options.connVer}.zip`
        options.connectorArchive = `mysql-connector-java-${options.connVer}.zip`
        options.downloadFile = `mysql-connector-java-${options.connVer}.zip`
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



module.exports = { setDB }