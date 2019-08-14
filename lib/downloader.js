const fs = require('fs')
const request = require('request')
const deployer = require('./deployer')
const manager = require('./manager')

function downloadArt(parameters, versionsArchive) {
    // parameters.version, versionsArchive, dirToDeploy
    const fileURL = `https://jfrog.bintray.com/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/${parameters.version}/${parameters.versionFile}`
    const filePath = `${versionsArchive}/${parameters.versionFile}`

    var out = fs.createWriteStream(filePath), contentLength = 0, downloaded = 0, percentage = 0, lastPercentage = 0

    var req = request({
        method: 'GET',
        uri: fileURL
    });

    req.pipe(out);

    req.on('response', function (data) {
        if (data.statusCode != 200) {
            console.log(`Error ${data.statusCode}: File not found`)
            fs.unlinkSync(filePath)
            console.log('Process finished')
            process.exit()
        }
        contentLength = data.headers['content-length'];
        console.log('Start downloading')
    })

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage;
            console.log(`Downloaded: ${percentage}%`);
        }
    })

    req.on('end', function () {
        console.log('Download finished, unzipping...')
        setTimeout(() => {
            deployer.deploy(parameters)
        }, 2000)
    })
}

function downloadJDBC(options) {
    // parameters.version, versionsArchive, dirToDeploy
    const filePath = `${manager.getDirectories().jdbc}/${options.downloadFile}`

    var out = fs.createWriteStream(filePath), contentLength = 0, downloaded = 0, percentage = 0, lastPercentage = 0

    var req = request({
        method: 'GET',
        uri: options.connectorUrl
    });

    req.pipe(out);

    req.on('response', function (data) {
        if (data.statusCode != 200) {
            console.log(`Error ${data.statusCode}: Connector not found, Please add the jar file manually to ${manager.getDirectories().jdbc}`)
            fs.unlinkSync(filePath)
            console.log('Process finished')
            process.exit()
        }
        contentLength = data.headers['content-length'];
        console.log('Start downloading')
    })

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage;
            console.log(`Downloaded: ${percentage}%`);
        }
    })

    req.on('end', function () {
        setTimeout(() => {
            switch (options.type) {
                case 'mysql':
                    deployer.deployJDBC(filePath, options)
                    break
                case 'postgresql':
                    console.log('Copying file')
                    fs.copyFileSync(options.connectorPath, options.targetPath)
                    break
            }
        }, 1000)

    })
}

module.exports = {
    downloadArt: downloadArt,
    downloadJDBC: downloadJDBC
}