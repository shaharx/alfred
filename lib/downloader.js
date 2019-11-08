const fs = require('fs')
const request = require('request')
const deployer = require('./deployer')
const manager = require('./manager')
const ls = require('./log-system')
const sjs = require('shelljs')
const ProgressBar = require("./progress-bar");

const Bar = new ProgressBar();

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
            ls.error(`Error ${data.statusCode}: File not found`)
            fs.unlinkSync(filePath)
            process.exit()
        }
        contentLength = data.headers['content-length'];
        ls.log('Download started')
        Bar.init(contentLength)
    })

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage
            Bar.update(downloaded)
            // ls.progress(`Downloaded: ${percentage}%`);
        }
    })

    req.on('end', function () {
        ls.success('Download finished, unzipping...')
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
            ls.error(`Error ${data.statusCode}: Connector not found, Please add the jar file manually to ${manager.getDirectories().jdbc}`)
            fs.unlinkSync(filePath)
            process.exit()
        }
        contentLength = data.headers['content-length'];
        ls.log('Download started')
        Bar.init(contentLength)
    })

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage
            Bar.update(downloaded)
            // ls.progress(`Downloaded: ${percentage}%`);
        }
    })

    req.on('end', function () {
        setTimeout(() => {
            switch (options.type) {
                case 'mysql':
                    deployer.deployJDBC(filePath, options)
                    break
                case 'postgresql':
                    fs.copyFileSync(options.connectorPath, options.targetPath)
                    break
            }
        }, 1000)

    })
}

function download(url, filePath, extractPath) {

    var out = fs.createWriteStream(filePath), contentLength = 0, downloaded = 0, percentage = 0, lastPercentage = 0

    var req = request({
        method: 'GET',
        uri: url
    });

    req.pipe(out);

    req.on('response', function (data) {
        if (data.statusCode != 200) {
            ls.error(`Error ${data.statusCode}: Please add the file manually to ${filePath} and unzip if necessary`)
            fs.unlinkSync(filePath)
            process.exit()
        }
        contentLength = data.headers['content-length'];
        ls.log('Start downloading')
    })

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage;
            ls.progress(`Downloaded: ${percentage}%`);
        }
    })

    req.on('end', function () {
        setTimeout(() => {
            deployer.deployFile(filePath, extractPath)
        }, 500)
    })
}

module.exports = {
    downloadArt: downloadArt,
    downloadJDBC: downloadJDBC,
    download: download
}