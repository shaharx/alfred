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


        var dboptions = {
            host: answers.ip,
            port: answers.port,
            user: answers.dbusername,
            password: answers.dbpassword
        }
        options.connector = `mysql-connector-java-${options.connVer}.jar`
        options.dbFile = dbFile
        options.connectorUrl = `http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${options.connVer}.zip`
        options.connectorArchive = `mysql-connector-java-${options.connVer}.zip`
        options.downloadFile = `mysql-connector-java-${options.connVer}.zip`
        options.queries = [`CREATE DATABASE ${answers.database} CHARACTER SET utf8 COLLATE utf8_bin;`, `GRANT ALL on ${answers.database}.* TO '${answers.username}'@'%' IDENTIFIED BY '${answers.password}';`, `FLUSH PRIVILEGES;`]
        runQueries(dboptions, options.queries)
        dbSetup.setDB(options)
    })

}

function runQueries(dboptions, queries) {
    console.log(dboptions)
    var mysql = require('mysql')
    var con = mysql.createConnection(dboptions);
    con.connect(function (err) {
        con.query(queries[0], function (err, result) {
            con.query(queries[1], function (err, result) {
                con.query(queries[2], function (err, result) {
                    if (err) throw err;
                    console.log("Result: " + `succesfully ran ${queries[2]}`);
                con.end()
            });
            if (err) throw err;
            console.log("Result: " + `succesfully ran ${queries[1]}`);
        });
        if (err) throw err;
        console.log("Result: " + `succesfully ran ${queries[0]}`);
        });
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + con.threadId);
    });
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
    name: 'dbusername',
    message: 'database username:',
    default: 'root'
}, {
    type: 'input',
    name: 'dbpassword',
    message: 'database password:',
    default: 'pass'
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