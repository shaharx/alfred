const fs = require('fs');
const request = require('request');
var progress = require('request-progress');

function downloadArt(version, pathToDownload) {
    console.log('new version');
    const fileName = `jfrog-artifactory-pro-${version}.zip`
    const fileURL = `https://jfrog.bintray.com/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/${version}/${fileName}`;

    var out = fs.createWriteStream(`${pathToDownload}/${fileName}`);
    var contentLength = 0;
    var downloaded = 0;
    var percentage = 0;
    var lastPercentage = 0;

    var req = request({
        method: 'GET',
        uri: fileURL
    });

    req.pipe(out);

    req.on('data', function (chunk) {
        downloaded += chunk.length;
        percentage = Math.floor((downloaded / contentLength) * 100);
        if (percentage > lastPercentage) {
            lastPercentage = percentage;
            console.log(`Downloaded: ${percentage}%`);
            // console.log(`True: ${lastPercentage} : ${percentage}%`);
        }
    });

    req.on('response', function (data) {
        contentLength = data.headers['content-length'];
    });

    req.on('end', function () {
        require('../lib/caseManager').createCaseAfterDownload()
    });
}
module.exports = { downloadArt }
