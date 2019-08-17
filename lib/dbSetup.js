const fs = require('fs')
const manager = require('./manager')
const storageManager = require('./storageManager')
const dl = require('./downloader')

function setDB(options) {
    options.connectorPath = `${manager.getDirectories().jdbc}/${options.connector}`
    options.targetPath = `${options.path}/tomcat/lib/${options.connector}`
    fs.writeFileSync(`${options.path}/etc/db.properties`, options.dbFile)
    console.log('db.properties set.\n The following queries will be run:')
    options.queries.forEach(element => {
        console.log(element)
    })
    storageManager.getJdbcConnector(options)
}

module.exports = { setDB }