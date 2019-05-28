const fs = require('fs');
const program = require('commander');
const { exec } = require('child_process');
const dl = require('./downloader');
const unzipper = require('./deployer');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`

const directories = {
    homeDir: alfredHome,
    cases_path: `${alfredHome}/cases`,
    versions_archive: `${alfredHome}/versions_archive`
}

const configFiles = {
    default_server_path: `${alfredHome}/default_server_path`
}

function getDirectories() {

    console.log("Checking directories");
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
            console.log(`${directories[path]} was not found, a new one was created.`);
        }
    }
    return directories
}

function setDefaultServerPath(server_path) {
    fs.writeFileSync(configFiles.default_server_path, server_path)
}

function getDefaultServerPath() {
    var path = ''
    try {
        path = fs.readFileSync(configFiles.default_server_path, 'utf8')
    }catch(e){
        console.log('Default server path was not found')
    }
    return path
}

module.exports = {
    getDirectories: getDirectories,
    getDefaultServerPath: getDefaultServerPath,
    setDefaultServerPath: setDefaultServerPath
}