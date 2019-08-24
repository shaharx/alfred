const program = require('commander')
const pkg = require('../package.json')
const manager = require('../lib/manager')
const dl = require('../lib/downloader')
const ls = require('../lib/log-system')

const defaultUrl = "https://shaharl.jfrog.io/shaharl/alfred-tools/logback-lib.zip"

program
    .version(pkg.version)
    .option('-u, --url [url]', 'The url to download from', defaultUrl)
    .option('-n, --username [username]', 'username')
    .option('-p, --password [password]', 'password')
    .action(() => {
        if (!program.username || ! program.password){
            ls.error('Not all credentials were passed on')
            process.exit()
        }
        var logbackDir = manager.getDirectories().logback
        var protocol = program.url.includes('https://') ? 'https://' : 'http://'
        var addedCredentials = `${protocol}${program.username}:${program.password}@`
        var newUrl = program.url.replace(protocol, addedCredentials)
        var fileName = program.url.split('/')
        fileName = fileName[fileName.length - 1]
        var filePath = `${logbackDir}/${fileName}`
        const options = {
            method: 'GET',
            uri: newUrl
        }
        dl.download(newUrl, filePath, logbackDir)
    })

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv)