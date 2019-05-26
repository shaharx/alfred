const fs = require('fs')
const request = require('request')
const unzipper = require('./unzipper')

function downloadArt(version, pathToDownload, dirToDeploy) {
    const fileName = `jfrog-artifactory-pro-${version}.zip`
    const fileURL = `https://jfrog.bintray.com/artifactory-pro/org/artifactory/pro/jfrog-artifactory-pro/${version}/${fileName}`
    const filePath = `${pathToDownload}/${fileName}`

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
        if(data.statusCode != 200){
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
        setTimeout(()=>{
            unzipper.deploy(filePath, dirToDeploy, `artifactory-pro-${version}`)
        }, 2000)
        
    })

}

module.exports = { downloadArt }