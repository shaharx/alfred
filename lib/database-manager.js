const fs = require('fs')
const manager = require('./manager')
const storageManager = require('./storageManager')
const dl = require('./downloader')
const ls = require('./log-system')

function setDB(options) {
    options.connectorPath = `${manager.getDirectories().jdbc}/${options.connector}`
    options.targetPath = `${options.path}/tomcat/lib/${options.connector}`
    fs.writeFileSync(`${options.path}/etc/db.properties`, options.dbFile)
    ls.success('db.properties set')
    storageManager.getJdbcConnector(options)
}

function getTemplates() {
    var templates = [
        `# MYSQL: alfred db set -t mysql -o alfred db set -t mysql -o '{"host":"localhost","port":"3306","mysql_username":"root","mysql_password":"pass","art_dbname":"artdb","artifactory_db_username":"artifactory","artifactory_db_password":"password"}'`,
        `# POSTGRES: alfred db set -t postgresql -o '{"host":"localhost","port":"5432","psql_username":"postgres","psql_database":"postgres","psql_password":"pass","art_dbname":"artifactory","artifactory_db_username":"artifactory","artifactory_db_password":"password"}'`
    ]
    ls.log(`For your convenience, here are templates with default values of commands to run. Values can be changes accordingly`)
    templates.forEach(command => {
        ls.log(`\n${command}\n`)
    })
}


module.exports = {
    setDB: setDB,
    getTemplates: getTemplates
}