const dbSetup = require('../../lib/database-manager')
const ls = require('../../lib/log-system')
var dockerCLI = require('docker-cli-js')
var Docker = dockerCLI.Docker

function setDB(options) {
    var parameters = options.parameters ? options.parameters : defaultParameters

    dbFile =
        `type=mysql\n` +
        `driver=com.mysql.jdbc.Driver\n` +
        `url=jdbc:mysql://${parameters.host}:${parameters.port}/${parameters.art_dbname}?characterEncoding=UTF-8&elideSetAutoCommits=true&useSSL=false\n` +
        `username=${parameters.artifactory_db_username}\n` +
        `password=${parameters.artifactory_db_password}\n`

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
    options.queries = [`CREATE DATABASE ${parameters.art_dbname} CHARACTER SET utf8 COLLATE utf8_bin;`, `GRANT ALL on ${parameters.art_dbname}.* TO '${parameters.artifactory_db_username}'@'%' IDENTIFIED BY '${parameters.artifactory_db_password}';`, `FLUSH PRIVILEGES;`]

    if (options.new) {
        var docker = new Docker();
        var image = options.image ? options.image : 'mysql:5.7'
        var dockerCommand = `run --name alfred_mysql -p ${dboptions.port}:3306 -e MYSQL_ROOT_PASSWORD=${dboptions.password} -d ${image}`
        docker.command(dockerCommand)
            .then(function (data) {
                var interval = setInterval(() => {
                    runQueries(dboptions, options.queries, interval)
                }, 10000)
            })
    }
    else if (options.skipQuery) { ls.warn('Skipped running queries in the database') }
    else { runQueries(dboptions, options.queries, false) }

    if (options.skipSettings) { ls.warn('Skipped the database in Artifactory') }
    else { dbSetup.setDB(options) }
}

function runQueries(dboptions, queries, interval) {
    ls.warn(JSON.stringify(dboptions, undefined, 2))
    var mysql = require('mysql')
    var con = mysql.createConnection(dboptions);
    con.connect(function (err) {
        if(err){ls.error(err)}
        con.query(queries[0], function (err, result) {
            con.query(queries[1], function (err, result) {
                con.query(queries[2], function (err, result) {
                    err ? ls.error(err) : ls.success(`succesfully ran ${queries[2]}`);
                    con.end()
                });
                err ? ls.error(err) : ls.success(`succesfully ran ${queries[1]}`);
            });
            if (!err) {
                if (interval) { clearInterval(interval) }
                ls.success(`succesfully ran ${queries[0]}`)
            } else { ls.error(err) }
        })
        ls.log('connected to the database as id ' + con.threadId);
    });
}

var defaultParameters = {
    host: 'localhost',
    port: '3306',
    mysql_username: 'root',
    mysql_password: 'pass',
    art_dbname: 'artdb',
    artifactory_db_username: 'artifactory',
    artifactory_db_password: 'password'
}

module.exports = { setDB }