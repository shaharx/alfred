const manager = require('./manager')
const fs = require('fs')
const dl = require('./downloader')
const deployer = require('./deployer')

function getVersion(parameters) { // get artifactory
    // archivePath, dirToDeploy
    const versionsArchive = manager.getDirectories().versions_archive
    var updatedParameters = {
        ...parameters,
        versionFile: `jfrog-artifactory-pro-${parameters.version}.zip`,
        archivePath: `${versionsArchive}/jfrog-artifactory-pro-${parameters.version}.zip`,
        deployFolder: `artifactory-pro-${parameters.version}`
    }
    updatedParameters.absolutePath = parameters.state == 'deploy' ? `${updatedParameters.path}/${updatedParameters.deployFolder}` : updatedParameters.path
    if (!deployer.checkExistingFile(updatedParameters.archivePath)) {
        console.log('File does not exist or is corrupted, it\'s not important. downloading new one', updatedParameters.archivePath)
        dl.downloadArt(updatedParameters, versionsArchive)
    } else {
        deployer.deploy(updatedParameters)
    }
}

function getJdbcConnector(options) {
    if (fs.existsSync(options.connectorPath)){
        console.log('connector found.')
        fs.copyFileSync(options.connectorPath, options.targetPath)
    } else {
        console.log('connector not found, downloading.')
        dl.downloadJDBC(options)
    }
}

module.exports = {
    getVersion: getVersion,
    getJdbcConnector: getJdbcConnector
}