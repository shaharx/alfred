const fs = require('fs')
const readLine = require('readline')
const im = require('./instanceManager')
const ls = require('./log-system')

function addProp(options) {
    var filePath = options.path + im.getPath().systemProperties
    var propsFile = fs.readFileSync(filePath, 'utf8')
    readline = require('readline'),
        instream = fs.createReadStream(filePath),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream)

    var parameterName = options.parameter.split('=')[0]
    var parameterValue = options.parameter.split('=')[1]
    var newFile = ''
    rl.on('line', function (line) {
        if (line.includes(parameterName)) {
            var newLine = `${parameterName}=${parameterValue}`
            newFile += newLine + '\n'
        } else {
            newFile += line + '\n'
        }
    })

    rl.on('close', function (line) {
        fs.writeFileSync(filePath, newFile)
    })
}

function removeProp(options) {
    var filePath = options.path + im.getPath().systemProperties
    var propsFile = fs.readFileSync(filePath, 'utf8')
    readline = require('readline'),
        instream = fs.createReadStream(filePath),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream)
    var lineFound = false
    var newFile = ''
    rl.on('line', function (line) {
        if (line.includes(options.parameter)) {
            var newLine = `#${line}`
            newFile += newLine + '\n'
            lineFound = true
        } else { newFile += line + '\n'}

    })

    rl.on('close', function (line) {
        fs.writeFileSync(filePath, newFile)
    })
}

module.exports = {
    add: addProp,
    remove: removeProp
}