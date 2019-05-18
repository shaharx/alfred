const fs = require('fs');
const program = require('commander');
const { exec } = require('child_process');
const dl = require('../lib/downloader');
const unzipper = require('../lib/unzipper');

function getDirectories() {
    const alfredHome = `${require("os").userInfo().homedir}/.alfred`
    const directories = {
        cases_path: `${alfredHome}/cases`,
        versions_archive: `${alfredHome}/versions_archive`
    }
    console.log("Checking directories");
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
            console.log(`${directories[path]} was not found, a new one was created.`);
        }
    }
    return directories
}

module.exports = { getDirectories }