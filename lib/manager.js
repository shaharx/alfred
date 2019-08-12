const fs = require('fs');

const alfredHome = `${require("os").userInfo().homedir}/.alfred`

const directories = {
    homeDir: alfredHome,
    cases_path: `${alfredHome}/cases`,
    versions_archive: `${alfredHome}/versions_archive`,
    jdbc: `${alfredHome}/tools/jdbc-connectors`
}

const configFiles = {
    default_server_path: `${alfredHome}/default_server_path`,
    instanceMetadata: '/instance_metadata',
}

function getDirectories() {
    console.log("Checking directories")
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
    } catch (e) {
        console.log('Default server path was not found')
    }
    return path
}

function getInstanceMetadata(instancePath) {
    var instanceMetadata = {}
    try {
        instanceMetadata = fs.readFileSync(instancePath + configFiles.instanceMetadata, 'utf8')
        instanceMetadata = JSON.parse(instanceMetadata)
    } catch (e) {
        console.log(`No file was found: \n ${e}`)
    }
    return instanceMetadata
}

function setInstanceMetadata (parameters) {
    fs.writeFileSync(parameters.absolutePath + configFiles.instanceMetadata, JSON.stringify(parameters, undefined, 2))
}



module.exports = {
    getDirectories: getDirectories,
    getDefaultServerPath: getDefaultServerPath,
    setDefaultServerPath: setDefaultServerPath,
    getInstanceMetadata: getInstanceMetadata,
    setInstanceMetadata: setInstanceMetadata
    // setDB: setDB
}