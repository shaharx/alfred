const fs = require('fs')
const manager = require('../../lib/manager')

function set (options) {
    const connectorPath = `${manager.getDirectories.jdbc}/${options.connector}`
    fs.writeFileSync(`${options.path}/etc/db.properties`, options.dbFile)
    if(fs.existsSync(connectorPath)){
        fs.copyFileSync(connectorPath, `${options.path}/tomcat/lib/${options.connector}`)
    } else {
        console.log('connector does not exist. Tell the developer to add an option for me to download it')
        fix this man
    }
}

module.exports = { set }