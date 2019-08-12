const fs = require('fs')
const manager = require('./manager')
const dl = require('./downloader')

function setDB(options) {
    options.connectorPath = `${manager.getDirectories().jdbc}/${options.connector}`
    console.log(options)
    fs.writeFileSync(`${options.path}/etc/db.properties`, options.dbFile)
    if (fs.existsSync(options.connectorPath)) {
        fs.copyFileSync(options.connectorPath, `${options.path}/tomcat/lib/${options.connector}`)
    } else {
        options.tempArchive = `${manager.getDirectories().jdbc}/${options.connectorArchive}`
        console.log('connector does not exist. Tell the developer to add an option for me to download it')
        // fix this man
    }
}

module.exports = { setDB }