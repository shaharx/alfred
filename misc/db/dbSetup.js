const fs = require('fs')
const manager = require('../../lib/manager')

function setDB (path, content, connector, connectorUrl) {
    const connectorPath = `${manager.getDirectories.jdbc}/${connector}`
    fs.writeFileSync(`${path}/etc/db.properties`, content)
    if(fs.existsSync(connectorPath)){
        fs.copyFileSync(connectorPath, `${path}/tomcat/lib/${connector}`)
    } else {
        finish this
    }
}

module.exports = { setDB }