const fs = require('fs');
const dl = require('../lib/downloader');
const unzipper = require('../lib/unzipper');
const { exec } = require('child_process');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`;
var currentCaseNumber = '';
const directories = {
    casesPath: `${alfredHome}/cases`,
    versionsArchive: `${alfredHome}/versions_archive`
}

function createCase(caseNumber, artifactoryVersion) {
    currentCaseNumber = caseNumber;
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

function checkExistingCase(caseNumber) {
    const casePath = `${directories.casesPath}/${caseNumber}`;
    if (!fs.existsSync(casePath)) {
        fs.mkdirSync(casePath, { recursive: true });
    } else {
        // inquire about the existence of the path and delete accordingly
    }
}

function setupEnvironment(artifactoryVersion) {
    const versionFile = `${directories.versionsArchive}/jfrog-artifactory-pro-${artifactoryVersion}.zip`
    if (!fs.existsSync(versionFile)) {
        const currentCaseState = {
            version: artifactoryVersion,
            casePath: `${directories.casesPath}/${currentCaseNumber}`,
            caseInstanceVersion: versionFile
        }
        fs.writeFileSync(`${alfredHome}/currentCaseState`, JSON.stringify(currentCaseState));
        dl.downloadArt(artifactoryVersion, directories.versionsArchive);
    } else {
        unzipper.unzip(versionFile, `${directories.casesPath}/${currentCaseNumber}`);
        exec(`chmod +x ${directories.casesPath}/${currentCaseNumber}/artifactory-pro-${artifactoryVersion}/bin/*`, (err, stdout, stderr) => {
            if (err) {
                return;
            }
        });
    }
}
function createCaseAfterDownload() {
    var currentCaseState = JSON.parse(fs.readFileSync(`${alfredHome}/currentCaseState`, 'utf8'));
    unzipper.unzip(currentCaseState.caseInstanceVersion, `${directories.casesPath}/${currentCaseNumber}`);
    exec(`chmod +x ${directories.casesPath}/${currentCaseNumber}/artifactory-pro-${currentCaseState.version}/bin/*`, (err, stdout, stderr) => {
        if (err) {
            return;
        }
    });
}
module.exports = { createCase, createCaseAfterDownload }