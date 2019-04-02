const fs = require('fs');
const dl = require('../lib/downloader');
const unzipper = require('../lib/unzipper');
const { exec } = require('child_process');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`;

const directories = {
    casesPath: `${alfredHome}/cases`,
    versionsArchive: `${alfredHome}/versions_archive`
}
var caseProperties = {
    caseNumber: 0,
    instanceVersion: '0.0.0'
}

function () 

make the case manager perform checks and then redirect the request to the next module i.e. casecreator, caseupdate ...
function preChecks(caseNumber, artifactoryVersion) {
    caseProperties.caseNumber = caseNumber;
    caseProperties.instanceVersion = artifactoryVersion;
    checkState();
    checkExistingCase(caseNumber);
    setupEnvironment(artifactoryVersion);
}

function checkState() {
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
        }
    }
}
function setupEnvironment(artifactoryVersion) {
    const versionFile = `${directories.versionsArchive}/jfrog-artifactory-pro-${artifactoryVersion}.zip`
    if (!fs.existsSync(versionFile)) {
        const currentCaseState = {
            version: artifactoryVersion,
            casePath: `${directories.casesPath}/${caseProperties.caseNumber}`,
            caseInstanceVersion: versionFile
        }
        fs.writeFileSync(`${alfredHome}/currentCaseState`, JSON.stringify(currentCaseState));
        dl.downloadArt(artifactoryVersion, directories.versionsArchive);
    } else {
        downloadFinished();
    }
}
function downloadFinished() {
    var currentCaseState = JSON.parse(fs.readFileSync(`${alfredHome}/currentCaseState`, 'utf8'));
    unzipper.unzip(currentCaseState.caseInstanceVersion, `${directories.casesPath}/${caseProperties.caseNumber}`);
    exec(`chmod +x ${directories.casesPath}/${caseProperties.caseNumber}/artifactory-pro-${currentCaseState.version}/bin/*`, (err, stdout, stderr) => {
        if (err) {
            return err;
        }
    });
}
module.exports = { createCase: preChecks, createCaseAfterDownload: downloadFinished }