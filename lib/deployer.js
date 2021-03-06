const manager = require('./manager')
const instanceManager = require('./instanceManager')
const { exec } = require('child_process')
const AdmZip = require('adm-zip')
const inquirer = require('inquirer')
const fs = require('fs')
const ls = require('./log-system')

// make a master function to determine the function to be called according to the state - upgrade or deploy etc..


function deploy(parameters) {
    const state = parameters.state
    delete parameters.state
    switch (state) {
        case 'deploy':
            instanceDeploy(parameters)
            break
        case 'upgrade':
            upgradeDeploy(parameters)
            break
        default:
            ls.error('No state found')
            break
    }
}

function instanceDeploy(parameters) {
    var zip = new AdmZip(parameters.archivePath)
    zip.extractAllTo(/*target path*/parameters.path, /*overwrite*/true)
    instanceManager.setInstanceMetadata(parameters)
    if(parameters.default){manager.setDefaultServerPath(parameters.absolutePath)}
    if(parameters.license){manager.setLicense(parameters.license, parameters.absolutePath)}
    exec(`chmod +x ${parameters.absolutePath}/bin/*`, (err, stdout, stderr) => {
        if (err) {
            return err;
        }
    })
    ls.success(`Artifactory was successfully deployed at ${parameters.absolutePath}`)
    // inquirer.prompt([{
    //     type: 'input',
    //     name: 'setDefaultPath',
    //     message: `Artifactory was deployed successfuly at ${parameters.absolutePath}\nwould you like to set its path as default?`
    // }, {
    //     type: 'input',
    //     name: 'afterDeployAction',
    //     message: 'Would you like to start it?'
    // }]).then(answers => {
    //     switch (answers.setDefaultPath) {
    //         case 'y':
    //             ls.log(`Default server path was set to ${parameters.absolutePath}`)
    //             manager.setDefaultServerPath(parameters.absolutePath)
    //             break
    //         default:
    //             ls.log('No default path was set')
    //             break
    //     }
    //     switch (answers.afterDeployAction) {
    //         case 'y':
    //             ls.log('Starting Artifactory')
    //             ls.log(`. /${parameters.absolutePath}/bin/artifactory.sh start`)
    //             exec(`. /${parameters.absolutePath}/bin/artifactory.sh start`, (err, stdout, stderr) => {
    //                 if (err) {
    //                     return err;
    //                 }
    //                 ls.log(stdout)
    //             })
    //             break
    //         default:
    //             ls.log('Artifactory has not been started.')
    //             break
    //     }
    // })
}

function upgradeDeploy(parameters) {
    var zip = new AdmZip(parameters.archivePath)
    var zipEntries = zip.getEntries()
    var filesToReplace = [
        '/webapps/artifactory.war',
        '/webapps/access.war',
        '/misc/',
        '/bin/',
        '/tomcat/'
    ]
    zipEntries.forEach(function (zipEntry) {
        filesToReplace.forEach((file) => {
            var currentFilePath = parameters.absolutePath + '/' + zipEntry.entryName
            var targetFilePath = parameters.absolutePath + zipEntry.entryName.replace(`artifactory-pro-${parameters.version}`, '')
            if (zipEntry.entryName.includes(file)) {
                if (fs.existsSync(targetFilePath)) {
                    var stats = fs.statSync(targetFilePath)
                    if (stats.isDirectory()) {
                        return
                    }
                    // fs.unlinkSync(targetFilePath)
                }
                zip.extractEntryTo(zipEntry, parameters.absolutePath, true, true)
                fs.renameSync(currentFilePath, targetFilePath)
                exec(`chmod +x ${parameters.absolutePath}/bin/*`, (err, stdout, stderr) => {
                    if (err) {
                        return err;
                    }
                })
            }
        })
    })
    instanceManager.setInstanceMetadata(parameters)
    ls.success('Upgrade Done')

}

function deployJDBC(filePath, options) {
    const jdbcPath = manager.getDirectories().jdbc
    var zip = new AdmZip(filePath)
    var zipEntries = zip.getEntries()
    zipEntries.forEach(zipEntry => {
        if (zipEntry.entryName.includes(options.connector)) {
            zip.extractEntryTo(zipEntry, jdbcPath, true, true)
            fs.renameSync(`${jdbcPath}/${zipEntry.entryName}`, options.connectorPath)
            fs.copyFileSync(options.connectorPath, options.targetPath)
        }
    })
    fs.unlinkSync(filePath)
    fs.rmdirSync(filePath.substring(0, filePath.length - 4))
}


function deployFile(archivePath, extractPath) {
    var zip = new AdmZip(archivePath)
    zip.extractAllTo(extractPath, true)
    fs.unlinkSync(archivePath)
}

function checkExistingFile(archivePath) {
    try {
        zip = new AdmZip(archivePath)
    } catch (err) {
        return false
    }
    return true
}

module.exports = {
    deploy: deploy,
    checkExistingFile: checkExistingFile,
    deployJDBC: deployJDBC,
    deployFile: deployFile
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