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

module.exports = { setDB }