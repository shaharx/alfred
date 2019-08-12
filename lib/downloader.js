const fs = require('fs')
const request = require('request')
const deployer = require('./deployer')

function downloadArt(parameters, versionsArchive) {
    // parameters.version, versionsArchive, dirToDeploy
    const fileURL = `https://jfrog.bintray.com/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/${parameters.version}/${parameters.versionFile}`
    const filePath = `${versionsArchive}/${parameters.versionFile}`

    var out = fs.createWriteStream(filePath);
    var contentLength = 0;
    var downloaded = 0;
    var percentage = 0;
    var lastPercentage = 0;

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
    const filePath = options.tempArchive

    var out = fs.createWriteStream(filePath), contentLength = 0, downloaded = 0, percentage = 0, lastPercentage = 0

    var req = request({
        method: 'GET',
        uri: options.connectorUrl
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
            deployer.deployJDBC(options)
        }, 2000)
    })
}

module.exports = {
    downloadArt: downloadArt,
    downloadJDBC: downloadJDBC
}