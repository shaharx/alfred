const fs = require('fs');
const dl = require('../lib/downloader');
const unzipper = require('../lib/unzipper');
const { exec } = require('child_process');

const artHome = `${require("os").userInfo().homedir}/.artifactories`;
const directories = {
    casesPath: `${artHome}/cases`,
    versionsArchive: `${artHome}/versions_archive`
}
var currentCaseNumber = '';

function createCase(caseNumber, artifactoryVersion) {
    currentCaseNumber = caseNumber;
    checkState();
    checkExistingCase(caseNumber);
    checkExistingVersion(artifactoryVersion);
}

function checkState() {
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
        }
    }
}

function checkExistingCase(caseNumber) {
    const casePath = `${directories.casesPath}/${caseNumber}`;
    if (!fs.existsSync(casePath)) {
        fs.mkdirSync(casePath, { recursive: true });
    } else {
        // inquire about the existence of the path and delete accordingly
    }
}

function checkExistingVersion(artifactoryVersion) {
    const versionFile = `${directories.versionsArchive}/jfrog-artifactory-pro-${artifactoryVersion}.zip`
    // createCaseAfterDownload('/Users/shaharl/.artifactories/versions_archive/jfrog-artifactory-pro-4.0.0.zip');
    if (!fs.existsSync(versionFile)) {
        const currentCaseState = {
            casePath: `${directories.casesPath}/${currentCaseNumber}`,
            caseInstanceVersion: versionFile
        }
        fs.writeFileSync(`${artHome}/currentCaseState`, JSON.stringify(currentCaseState));
        dl.downloadArt(artifactoryVersion, directories.versionsArchive);
    } else {
        unzipper.unzip(versionFile, `${directories.casesPath}/${currentCaseNumber}`);
        exec(`chmod +x ${directories.casesPath}/${currentCaseNumber}/artifactory-pro-4.0.0/bin/*`, (err, stdout, stderr) => {
            if (err) {
                return;
            }
        });
    }
}
function createCaseAfterDownload() {
    var currentCaseState = JSON.parse(fs.readFileSync(`${artHome}/currentCaseState`, 'utf8'));
    unzipper.unzip(currentCaseState.caseInstanceVersion, `${directories.casesPath}/${currentCaseNumber}`);
}


module.exports = { createCase, createCaseAfterDownload }