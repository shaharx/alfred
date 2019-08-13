const fs = require('fs')
const manager = require('./manager')
const storageManager = require('./storageManager')
const dl = require('./downloader')

function setDB(options) {
    options.connectorPath = `${manager.getDirectories().jdbc}/${options.connector}`
    options.targetPath = `${options.path}/tomcat/lib/${options.connector}`
    fs.writeFileSync(`${options.path}/etc/db.properties`, options.dbFile)
    console.log(options)
    storageManager.getJdbcConnector(options)
    // if (fs.existsSync(options.connectorPath)) {
    //     fs.copyFileSync(options.connectorPath, `${options.path}/tomcat/lib/${options.connector}`)
    // } else {
    //     options.tempArchive = `${manager.getDirectories().jdbc}/${options.connectorArchive}`
    //     console.log('connector does not exist. Tell the developer to add an option for me to download it')
    //     // fix this man
    // }
}

module.exports = { setDB }