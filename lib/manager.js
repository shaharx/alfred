const fs = require('fs');
const ls = require('./log-system')

const alfredHome = `${require("os").userInfo().homedir}/.alfred`

const directories = {
    homeDir: alfredHome,
    cases_path: `${alfredHome}/cases`,
    versions_archive: `${alfredHome}/versions_archive`,
    jdbc: `${alfredHome}/tools/jdbc-connectors`,
    logback: `${alfredHome}/tools/logback-snippets`,
    licenses: `${alfredHome}/licenses`
}

const configFiles = {
    default_server_path: `${alfredHome}/default_server_path`
}

function getDirectories() {
    ls.log("Checking directories")
    for (var path in directories) {
        if (!fs.existsSync(directories[path])) {
            fs.mkdirSync(directories[path], { recursive: true });
            ls.log(`${directories[path]} was not found, a new one was created.`);
        }
    }
    return directories
}

function setDefaultServerPath(server_path) {
    try {
        fs.writeFileSync(configFiles.default_server_path, server_path)
        ls.success(`Successfully set ${server_path} as the default server`)
    } catch(e){
        ls.error(`could not set ${server_path} as the default server\n${e}`)
    }
}

function getDefaultServerPath() {
    var path = ''
    try {
        path = fs.readFileSync(configFiles.default_server_path, 'utf8')
    } catch (e) {
        ls.error(e)
    }
    return path
}

module.exports = {
    getDirectories: getDirectories,
    getDefaultServerPath: getDefaultServerPath,
    setDefaultServerPath: setDefaultServerPath
}