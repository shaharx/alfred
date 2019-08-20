const fs = require('fs')
const manager = require('./manager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })

const logbackSnippetsPath = manager.getDirectories().logback

const getLogbackFile = (path) => {
    return `${path}/etc/logback.xml`
}
const logbackSnippetsPaths = () => {
    return paths = {
        loggers: `${logbackSnippetsPath}/logback-loggers.xml`,
        appenders: `${logbackSnippetsPath}/logback-appenders.xml`
    }
}
// MAKE SURE THAT THERE ARE NOT TWO XRAY OR ANY OTHER APPENDER

function addLogger(path, loggerName) {
    var pathToLogback = getLogbackFile(path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    var existsInLogbackFile = snippetExists(parsedLogbackFile.configuration.logger, loggerName)

    if (existsInLogbackFile.exists) {
        ls.log('logger already exist in the logback.xml file')
        process.exit()
    }
    var parsedLoggersFile = parseXml(logbackSnippetsPaths().loggers)

    var logger = snippetExists(parsedLoggersFile.configuration.logger, loggerName)

    if (logger.exists) {
        parsedLogbackFile.configuration.logger.push(logger.element)
        finalMessage = `The logger ${loggerName} was added to the logback.xml file`
    }
    else {
        ls.error(`The logger ${logger.name} does not exist in the loggers file.`)
        process.exit()
    }
    var appenderName = extractAppender(logger.element)
    if (appenderName.exists) {
        console.log('here')
        existsInLogbackFile = snippetExists(parsedLogbackFile.configuration.appender, appenderName.name) // Check if exists in the logback.xml file

        if (!existsInLogbackFile.exists) {
            var parsedAppendersFile = parseXml(logbackSnippetsPaths().appenders)
            var appender = snippetExists(parsedAppendersFile.configuration.appender, appenderName.name)
            if (appender.exists) {
                parsedLogbackFile.configuration.appender.push(appender.element)
                finalMessage += ` along with its appender '${appenderName.name}'`
            } else {
                ls.error(`The appender ${appenderName.name} does not exist in the appenders file`)
            }
        } else {
            ls.log(`The appender ${appenderName.name} already exist in the logback.xml`)
        }
    }
    ls.log(finalMessage)
    buildXml(parsedLogbackFile, pathToLogback)

}

function removeLogger(path, loggerName) {

}

function list() {
    var parsedLoggersFile = parseXml(logbackSnippetsPaths().loggers)
    console.log('Here are the names of the available loggers')
    parsedLoggersFile.configuration.logger.forEach(logger => {
        console.log(logger.ATTR.name)
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

function buildXml(xml, pathToWrite) {
    xml = builder.buildObject(xml)
    fs.writeFileSync(pathToWrite, xml)
    ls.log('logback.xml file was modified successfully')
}

function snippetExists(list, name) {
    var results = {
        exists: false
    }
    list.forEach(element => {
        if (element.ATTR.name == name) {
            console.log(`${element.ATTR.name} = ${name}`)
            results.exists = true
            results.element = element
        }
    })
    return results
}

function extractAppender(loggerObject) {
    var results = {
        exists: false,
    }
    var stringifiedLogger = JSON.stringify(loggerObject)

    if (stringifiedLogger.includes('appender-ref')) {
        results.exists = true
        stringifiedLogger = stringifiedLogger.replace('appender-ref', 'appender_ref')
        results.name = JSON.parse(stringifiedLogger).appender_ref[0].ATTR.ref
    }
    return results
}

module.exports = {
    addLogger: addLogger,
    removeLogger: removeLogger,
    list: list
}