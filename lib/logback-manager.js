const fs = require('fs')
const manager = require('./manager')
const im = require('./instanceManager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
const builder = new xml2js.Builder({ attrkey: "ATTR" })

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
function addLogger(path, loggerName, index, level) {
    var pathToLogback = getLogbackFile(path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    var existsInLogbackFile = snippetExists(parsedLogbackFile.configuration.logger, loggerName)

    if (existsInLogbackFile.exists) {
        ls.warn(`The logger ${loggerName} already exist in the logback.xml file.`)
        process.exit()
    }
    var parsedLoggersFile = parseXml(logbackSnippetsPaths().loggers)

    var logger = snippetExists(parsedLoggersFile.configuration.logger, loggerName)
    if (logger.exists) {
        if (logger.elements.length > 1 && !index) {
            inquireForDuplicates(logger.elements)
            process.exit()
        }
        else if (logger.elements.length > 1 && index) { logger.element = logger.elements[index] }
        else { logger.element = logger.elements[0] }
        if (level) { logger.element.level[0].ATTR.value = level }
        parsedLogbackFile.configuration.logger.push(logger.element)
        finalMessage = `The logger ${loggerName} was added to the logback.xml file`
    }
    else {
        ls.error(`The logger ${loggerName} does not exist in the loggers file.`)
        process.exit()
    }

    var appenderName = extractAppender(logger.element)
    if (appenderName.exists) {
        existsInLogbackFile = snippetExists(parsedLogbackFile.configuration.appender, appenderName.name) // Check if exists in the logback.xml file

        if (!existsInLogbackFile.exists) {
            var parsedAppendersFile = parseXml(logbackSnippetsPaths().appenders)
            var appender = snippetExists(parsedAppendersFile.configuration.appender, appenderName.name)
            if (appender.exists) {
                appender.element = appender.elements[0]
                parsedLogbackFile.configuration.appender.push(appender.element)
                finalMessage += ` along with its appender '${appenderName.name}'`
            } else {
                ls.error(`The appender ${appenderName.name} does not exist in the appenders file`)
            }
        } else {
            ls.log(`The appender ${appenderName.name} already exist in the logback.xml`)
        }
    }

    xml = buildXml(parsedLogbackFile)
    fs.writeFileSync(pathToLogback, xml)
    ls.log(finalMessage)
    ls.success('logback.xml file was modified successfully')

}

function removeLogger(path, loggerName) {

    var pathToLogback = getLogbackFile(path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    var loggerToRemove = snippetExists(parsedLogbackFile.configuration.logger, loggerName)

    if (!loggerToRemove.exists) {
        ls.log('logger does not exist in the logback.xml file')
        process.exit()
    } else {
        var appender = {}
        var length = parsedLogbackFile.configuration.logger.length
        for (i = 0; i < length; i++) {
            if (parsedLogbackFile.configuration.logger[i].ATTR.name == loggerToRemove.elements[0].ATTR.name) {
                // GET THE NAME OF THE APPENDER AND REMOVE IT
                delete parsedLogbackFile.configuration.logger[i]
                var xml = buildXml(parsedLogbackFile)
                fs.writeFileSync(pathToLogback, xml)
                finalMessage += `The ${loggerToRemove.elements[0].ATTR.name} logger was successfuly removed `
            }
        }
        // REMOVE THE APPENDER HERE
    }
    finalMessage += 'from the logback.xml file'
    ls.log(finalMessage)
}

function changeLogLevel(options) {
    var pathToLogback = getLogbackFile(options.path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''
    
    for (i = 0; i < parsedLogbackFile.configuration.logger.length; i++) {
        if (parsedLogbackFile.configuration.logger[i].ATTR.name == options.loggerName) {
            parsedLogbackFile.configuration.logger[i].level[0].ATTR.value = options.level
            finalMessage = `Succesfully changed the log level of ${options.loggerName} to ${options.level}`
        }
    }
    if (finalMessage == '') { ls.error(`${options.loggerName} was not found in the logback.xml file`) }
    else { ls.success(finalMessage) }

    var xml = buildXml(parsedLogbackFile)
    im.write(pathToLogback, xml)
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

function snippetExists(list, name) {
    var results = {
        exists: false,
        elements: [],
    }
    list.forEach(element => {
        if (element.ATTR.name == name) {

            results.exists = true
            results.elements.push(element)
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

function inquireForDuplicates(loggers) {
    var question = 'Found more than one logger, please choose: \n\n'
    for (i = 0; i < loggers.length; i++) {
        question += `${i}:\n\n${buildXml(loggers[i])}\n\n`
    }
    question += 'please run the add command again and specify an index with the -i flag'

    ls.warn(question)
}

// check for duplicates and choose which appender to use

module.exports = {
    addLogger: addLogger,
    removeLogger: removeLogger,
    changeLogLevel: changeLogLevel,
    list: list
}