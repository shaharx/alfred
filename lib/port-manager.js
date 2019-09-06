const fs = require('fs')
const im = require('./instanceManager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
const builder = new xml2js.Builder({ attrkey: "ATTR" })

function setPort(options) {
    var pathToXml = `${options.path}${im.getPath().serverXml}`
    var xml = fs.readFileSync(pathToXml, 'utf8')
    var parameters = parseParameters(options.parameters)
    parameters.forEach(element => {
        if (xml.includes(element[0])) {
            xml = xml.replace(element[0], element[1])
        }
    })
    try {
        fs.writeFileSync(pathToXml, xml)
        ls.success('Successfully modified the server.xml file')
    } catch (e){
        ls.error(e)
    }

    // var xml = parseXml(`${options.path}${im.getPath().serverXml}`)
    // parameters.forEach(parameter => {
    //     var connectorLength = xml.Server.Service[0].Connector.length
    //     for (i = 0; i < connectorLength; i++) {
    //         if (xml.Server.Service[0].Connector[i].ATTR.port == parameter[0]) {
    //             xml.Server.Service[0].Connector[i].ATTR.port = parameter[1]
    //         }
    //     }
    // })
    // ls.log(xml.Server.Service[0].Connector)
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

function parseParameters(parameters) {
    var parametersList = parameters.split(' ')
    for (i = 0; i < parametersList.length; i++) {
        parametersList[i] = parametersList[i].split(':')
    }
    return parametersList
}

module.exports = { setPort }