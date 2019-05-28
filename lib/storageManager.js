const manager = require('./manager')
const fs = require('fs')
const dl = require('./downloader')
const deployer = require('./deployer')

function getVersion(version, dirToDeploy) {

    const versionFile = `jfrog-artifactory-pro-${version}.zip`
    const versionsArchive = manager.getDirectories().versions_archive
    const versionPath = `${versionsArchive}/${versionFile}`

    if (!deployer.checkExistingFile(versionPath)) {
        dl.downloadArt(version, versionsArchive, dirToDeploy)
    } else {
        deployer.deploy(versionPath, dirToDeploy, `artifactory-pro-${version}`)
    }
}

module.exports = { getVersion }