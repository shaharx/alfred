const fs = require('fs')
const manager = require('./manager')
const im = require('./instanceManager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })

const getBinarystoreFile = (path) => {
    return path + im.getPath().binarystoreFile
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
    try {
        fs.writeFileSync(pathToBinarystoreFile, xml)
        ls.success(`binarystore.xml was successfuly modified with the ${options.template} template`)
    } catch (e) {
        log.error(`Error writing the binarystore.xml file\n${e}`)
    }

}

function modifyProviderParameters(options) {
    var pathToBinarystoreFile = getBinarystoreFile(options.path)
    var parsedBinarystoreFile = parseXml(pathToBinarystoreFile)
    var parameters = parseParameters(options.parameters)
    if (!parsedBinarystoreFile.config.provider) { parsedBinarystoreFile.config.provider = createProvider(options.provider) }
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
    try {
        var xml = buildXml(parsedBinarystoreFile)
        fs.writeFileSync(pathToBinarystoreFile, xml)
        ls.success(`Successfuly modified the binarystore.xml file`)
    } catch (e) {
        ls.error(`Could not modify the binarystore.xml file\n${e}`)
    }
}

// remove providers and make parameters for the id and optionally the type to create the provider

function list() {

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