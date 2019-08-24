const fs = require('fs')
const manager = require('./manager')
const ls = require('./log-system')

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

function addChainTemplate(options) {
    var newBinarystoreFile = {
        config: {
            ATTR: { version: options.configVersion },
            chain: [{ ATTR: { template: options.template } }]
        }
    }
    var pathToBinarystoreFile = getBinarystoreFile(options.path)

    if (options.provider) { newBinarystoreFile.config.provider = createProvider(options.provider) }
    var xml = buildXml(newBinarystoreFile)
    fs.writeFileSync(pathToBinarystoreFile, xml)
}

function modifyProviderParameters(options) {
    var pathToBinarystoreFile = getBinarystoreFile(options.path)
    var parsedBinarystoreFile = parseXml(pathToBinarystoreFile)
    var providerExist = false
    var parameters = parseParameters(options.parameters)
    if(!parsedBinarystoreFile.config.provider){parsedBinarystoreFile.config.provider = createProvider(options.provider)}
    for (i = 0; i < parsedBinarystoreFile.config.provider.length; i++) {
        if (parsedBinarystoreFile.config.provider[i].ATTR.id == options.provider) {
            providerExist = true
            parameters.forEach(object => {
                parsedBinarystoreFile.config.provider[i] = {
                    ...parsedBinarystoreFile.config.provider[i],
                    ...object
                }
            })
        }
    }
    if (providerExist) {
        var xml = buildXml(parsedBinarystoreFile)
        fs.writeFileSync(pathToBinarystoreFile, xml)
    }
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

function parseParameters(parameters) {
    var parametersKeyValue = parameters.split(' ')
    var parametersList = []
    for (i = 0; i < parametersKeyValue.length; i++) {
        parametersKeyValue[i] = parametersKeyValue[i].split('=')
    }
    parametersKeyValue.forEach(keyVal => {
        var element = { YALLA_BEITAR: keyVal[1] }
        element = JSON.parse(JSON.stringify(element).replace("YALLA_BEITAR", keyVal[0]))
        parametersList.push(element)
    })
    return parametersList
}

function createProvider(provider) {
    var newProvider = []
    var attr = { ATTR: { id: provider, type: provider } }
    newProvider.push(attr)
    return newProvider
}

module.exports = {
    addChainTemplate: addChainTemplate,
    list: list,
    modifyProviderParameters: modifyProviderParameters
}