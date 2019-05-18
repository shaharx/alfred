const manager = require('./manager')
const fs = require('fs')
const dl = require('./downloader')
const unzipper = require('./unzipper')

function getVersion(version, dir) {
    const versionFile = `jfrog-artifactory-pro-${version}.zip`
    const versionsArchive = manager.getDirectories().versions_archive
    const versionPath = `${versionsArchive}/${versionFile}` 
    if (!fs.existsSync(versionPath)) {
        console.log('file does not exist, downloading new one');
        dl.downloadArt(version, versionsArchive);
        // process.exit()
    } else {
        unzipper.unzip(versionPath, dir);
        exec(`chmod +x ${instanceProperties.instance_home}/bin/*`, (err, stdout, stderr) => {
            if (err) {
                return err;
            }
        });
        console.log(`Instance ready. Run \'. ${instanceProperties.instance_home}/bin/artifactory.sh\' to start`);
    }
}

module.exports = { getVersion }