const { exec } = require('child_process')
const AdmZip = require('adm-zip')
const inquirer = require('inquirer')
const fs = require('fs')

function deploy(pathToArchive, dirToDeploy, deployFolder) {
    const deployDir = `${dirToDeploy}/${deployFolder}`
    var zip = new AdmZip(pathToArchive)
    zip.extractAllTo(/*target path*/dirToDeploy, /*overwrite*/true)
    exec(`chmod +x ${deployDir}/bin/*`, (err, stdout, stderr) => {
        if (err) {
            return err;
        }
    })
    inquirer.prompt([{
        type: 'input',
        name: 'setDefaultPath',
        message: `Artifactory was deployed successfuly at ${deployDir}\nwould you like to set its path as default?`
    }, {
        type: 'input',
        name: 'afterDeployAction',
        message: 'Would you like to start it?'
    }]).then(answers => {
        switch (answers.setDefaultPath) {
            case 'y':
                console.log(`Default server path was set to ${deployDir}`)
                require('./manager').setDefaultServerPath(deployDir)
                break
            default:
                console('No default path was set')
                break
        }
        switch (answers.afterDeployAction) {
            case 'y':
                console.log('Starting Artifactory')
                exec(`. /${deployDir}/bin/artifactory.sh start`, (err, stdout, stderr) => {
                    if (err) {
                        return err;
                    }
                    console.log(stdout)
                })
                break
            default:
                console.log('Artifactory has not been started.')
                break
        }
    })
}

function checkExistingFile(pathToArchive) {
    try {
        zip = new AdmZip(pathToArchive)
    } catch (err) {
        console.log('File does not exist or is corrupted, it\'s not important. downloading new one')
        return false
    }
    return true
}

function deployFiles(files) {

}

module.exports = {
    deploy: deploy,
    checkExistingFile: checkExistingFile,
    deployFiles: deployFiles
}
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