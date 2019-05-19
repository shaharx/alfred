const { exec } = require('child_process')
const AdmZip = require('adm-zip')

function deploy(pathToArchive, dirToDeploy, deployFolder) {

    var zip = new AdmZip(pathToArchive);
    zip.extractAllTo(/*target path*/dirToDeploy, /*overwrite*/true);
    exec(`chmod +x ${dirToDeploy}/${deployFolder}/bin/*`, (err, stdout, stderr) => {
        if (err) {
            return err;
        }
    })
    console.log(`Instance ready. Run \'. /${dirToDeploy}/${deployFolder}/bin/artifactory.sh\' to start`)
}

module.exports = { deploy }

// // reading archives
// var zip = new AdmZip("./jfrog-artifactory-pro-4.0.0.zip");
// var zipEntries = zip.getEntries(); // an array of ZipEntry records

// zipEntries.forEach(function (zipEntry) {
//     //console.log(zipEntry.toString()); // outputs zip entries information
//     if (zipEntry.entryName == "my_file.txt") {
//         //console.log(zipEntry.getData().toString('utf8'));
//     }
// });
// // outputs the content of some_folder/my_file.txt
// console.log(zip.readAsText("some_folder/my_file.txt"));
// // extracts the specified file to the specified location
// // zip.extractEntryTo(/*entry name*/"artifactory-pro-4.0.0/bin/artifactory.sh", /*target path*/"./unzipTest", /*maintainEntryPath*/false, /*overwrite*/true);
// // extracts everything
// zip.extractAllTo(/*target path*/"./unzipTest", /*overwrite*/true);