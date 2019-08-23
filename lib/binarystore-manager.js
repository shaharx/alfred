const fs = require('fs')
const manager = require('./manager')
const instanceManager = require('./instanceManager')
const ls = require('./log-system')
const inquire = require('inquirer')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })

const logbackSnippetsPath = manager.getDirectories().logback

const getBinarystoreFile = (path) => {
    return `${path}/etc/binarystore.xml`
}
const logbackSnippetsPaths = () => {
    return paths = {
        loggers: `${logbackSnippetsPath}/logback-loggers.xml`,
        appenders: `${logbackSnippetsPath}/logback-appenders.xml`
    }
}
// MAKE SURE THAT THERE ARE NOT TWO XRAY OR ANY OTHER APPENDER

function addChainTemplate(options) {
    var newBinarystoreFile = {
        config: {
            ATTR: { version: options.configVersion },
            chain: [{ ATTR: { tmplate: options.template } }]
        }
    }

    var pathToBinarystoreFile = getBinarystoreFile(options.path)
    var parsedBinarystoreFile = parseXml(pathToBinarystoreFile)

    if (options.provider) {
        if (!parsedBinarystoreFile.config.provider) {
            newBinarystoreFile.config.provider = []
        }
        var attr = { ATTR: { id: options.provider, type: options.provider } }
        newBinarystoreFile.config.provider.push(attr)
    }
    var xml = buildXml(newBinarystoreFile)
    fs.writeFileSync(pathToBinarystoreFile, xml)
}

function modifyProviderParameter(options) {

    var pathToBinarystoreFile = getBinarystoreFile(options.path)
    var parsedBinarystoreFile = parseXml(pathToBinarystoreFile)
    // var parameter = 
    for (i = 0; i < parsedBinarystoreFile.config.provider.length; i++) {
        if(parsedBinarystoreFile.config.provider[0].ATTR.id == options.provider){
            parsedBinarystoreFile.config.provider[0].identity = [123]
        }
    }
    ls.log(buildXml(parsedBinarystoreFile))
}

function list() {
    var parsedLoggersFile = parseXml(logbackSnippetsPaths().loggers)
    ls.log('Available loggers:')
    parsedLoggersFile.configuration.logger.forEach(logger => {
        ls.log(logger.ATTR.name)
    })
}

function parseXml(xml) {
    xml = fs.readFileSync(xml, 'utf8')
    var parsedXml = ''
    parser.parseString(xml, (error, result) => {
        if (error) { return error }
        parsedXml = result
    })
    return parsedXml
}

function buildXml(xml) {
    return builder.buildObject(xml)
}

module.exports = {
    addChainTemplate: addChainTemplate,
    list: list,
    modifyProviderParameter: modifyProviderParameter
}