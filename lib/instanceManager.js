const fs = require('fs')
const ls = require('./log-system')

const instancePaths = {
    instanceMetadata: '/instance_metadata',
    logbackFile: '/etc/logback.xml',
    binaryStoreFile: '/etc/binarystore.xml',
    pid: '/run/artifactory.pid'
}

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

module.exports = {
    getInstanceMetadata: getInstanceMetadata,
    setInstanceMetadata: setInstanceMetadata,
    getPath: getPath
}