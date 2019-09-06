const fs = require('fs')
const ls = require('./log-system')

function getInstanceMetadata(instancePath) {
    var instanceMetadata = {}
    try {
        instanceMetadata = fs.readFileSync(instancePath + instancePaths.instanceMetadata, 'utf8')
        instanceMetadata = JSON.parse(instanceMetadata)
    } catch (e) {
        ls.log(`No file was found: \n ${e}`)
    }
    return instanceMetadata
}

function setInstanceMetadata(parameters) {
    fs.writeFileSync(parameters.absolutePath + instancePaths.instanceMetadata, JSON.stringify(parameters, undefined, 2))
}

function getPath() {
    return instancePaths
}

function write(path, content) {
    try { fs.writeFileSync(path, content) }
    catch (e) { ls.error(`error writing to ${path}`) }
}

const instancePaths = {
    instanceMetadata: '/instance_metadata',
    logbackFile: '/etc/logback.xml',
    binarystoreFile: '/etc/binarystore.xml',
    pid: '/run/artifactory.pid',
    systemProperties: '/etc/artifactory.system.properties',
    license: '/etc/artifactory.lic',
    haNodeProperties: '/etc/ha-node.properties',
    serverXml: '/tomcat/conf/server.xml'
}

module.exports = {
    getInstanceMetadata: getInstanceMetadata,
    setInstanceMetadata: setInstanceMetadata,
    getPath: getPath,
    write: write
}