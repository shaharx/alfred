const inquirer = require('inquirer')
const dbSetup = require('../../lib/dbSetup')
const ls = require('../../lib/log-system')

function setDB(options) {
    // Parse the options argument and merge it with the parameters
    var parameters = {
        host: 'localhost',
        port: '3306',
        mysql_username: 'postgres',
        mysql_password: 'password',
        art_dbname: 'artdb',
        art_username: 'artifactory',
        art_password: 'password'
    }
    dbFile =
        `type=mysql\n` +
        `driver=com.mysql.jdbc.Driver\n` +
        `url=jdbc:mysql://${parameters.host}:${parameters.port}/${parameters.art_dbname}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false\n` +
        `username=${parameters.art_username}\n` +
        `password=${parameters.art_password}\n`


    var dboptions = {
        host: parameters.host,
        port: parameters.port,
        user: parameters.mysql_username,
        password: parameters.mysql_password
    }
    options.connector = `mysql-connector-java-${options.connVer}.jar`
    options.dbFile = dbFile
    options.connectorUrl = `http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${options.connVer}.zip`
    options.connectorArchive = `mysql-connector-java-${options.connVer}.zip`
    options.downloadFile = `mysql-connector-java-${options.connVer}.zip`
    options.queries = [`CREATE DATABASE ${parameters.art_dbname} CHARACTER SET utf8 COLLATE utf8_bin;`, `GRANT ALL on ${parameters.art_dbname}.* TO '${parameters.art_username}'@'%' IDENTIFIED BY '${parameters.art_password}';`, `FLUSH PRIVILEGES;`]
    
    if (options.skipQuery) { ls.warn('Skipped running queries in the database') }
    else { runQueries(dboptions, options.queries) }

    if (options.skipSettings) { ls.warn('Skipped the database in Artifactory') }
    else { dbSetup.setDB(options) }
}

function runQueries(dboptions, queries) {
    var mysql = require('mysql')
    var con = mysql.createConnection(dboptions);
    con.connect(function (err) {
        con.query(queries[0], function (err, result) {
            con.query(queries[1], function (err, result) {
                con.query(queries[2], function (err, result) {
                    if (err) throw err;
                    ls.success("Result: " + `succesfully ran ${queries[2]}`);
                    con.end()
                });
                if (err) throw err;
                ls.success("Result: " + `succesfully ran ${queries[1]}`);
            });
            if (err) throw err;
            ls.success("Result: " + `succesfully ran ${queries[0]}`);
        });
        if (err) {
            ls.error('error connecting:\n' + err.stack);
            return;
        }
        ls.log('connected to the database as id ' + con.threadId);
    });
}


module.exports = { setDB }