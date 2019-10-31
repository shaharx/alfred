const fs = require('fs')
const manager = require('./manager')
const im = require('./instanceManager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
const builder = new xml2js.Builder({ attrkey: "ATTR" })

const getLogbackFile = (path) => {
    return `${path}/etc/logback.xml`
}

function addLogger(options) {
    var pathToLogback = getLogbackFile(options.path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    if (snippetExists(parsedLogbackFile.configuration.logger, options.name)) {
        ls.warn(`The logger ${options.name} already exist in the logback.xml file.`)
        process.exit()
    }

    var newlogger = getLogger(options.name, options.level)
    var newAppender = ''
    if (options.appenderName) {
        newlogger.logger.ATTR.additivity = 'false'
        if (!snippetExists(parsedLogbackFile.configuration.appender, options.appenderName)) {
            newlogger.logger.appenderRef = [{ "ATTR": { "ref": options.appenderName } }]
            newlogger = JSON.parse(JSON.stringify(newlogger).replace('appenderRef', 'appender-ref'))
            newAppender = getAppender(options.appenderName)
        }
    }

    parsedLogbackFile.configuration.logger.push(newlogger.logger)
    finalMessage += `The logger ${options.name} was successfully added to the logback.xml file`
    if (newAppender != '') {
        parsedLogbackFile.configuration.appender.push(newAppender.appender)
        finalMessage += ` along with its appender '${options.appenderName}'`
    }
    newLogback = buildXml(parsedLogbackFile)
    im.write(pathToLogback, newLogback)
    ls.success(finalMessage)
}

function removeLogger(options) {
    var pathToLogback = getLogbackFile(options.path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    if (!snippetExists(parsedLogbackFile.configuration.logger, options.name)) {
        ls.warn('logger does not exist in the logback.xml file')
        process.exit()
    } else {
        var appender = {}
        var length = parsedLogbackFile.configuration.logger.length
        for (i = 0; i < length; i++) {
            if (parsedLogbackFile.configuration.logger[i].ATTR.name == options.name) {
                // GET THE NAME OF THE APPENDER AND REMOVE IT
                delete parsedLogbackFile.configuration.logger[i]
                var xml = buildXml(parsedLogbackFile)
                im.write(pathToLogback, xml)
                finalMessage += `The ${options.name} logger was successfuly removed `
            }
        }
        // REMOVE THE APPENDER HERE
    }
    finalMessage += 'from the logback.xml file'
    ls.success(finalMessage)
}

function changeLogLevel(options) {
    var pathToLogback = getLogbackFile(options.path)
    var parsedLogbackFile = parseXml(pathToLogback)
    var finalMessage = ''

    for (i = 0; i < parsedLogbackFile.configuration.logger.length; i++) {
        if (parsedLogbackFile.configuration.logger[i].ATTR.name == options.name) {
            parsedLogbackFile.configuration.logger[i].level[0].ATTR.value = options.level
            finalMessage = `Succesfully changed the log level of ${options.name} to ${options.level}`
        }
    }
    if (finalMessage == '') { ls.error(`${options.name} was not found in the logback.xml file`) }
    else { ls.success(finalMessage) }

    var xml = buildXml(parsedLogbackFile)
    im.write(pathToLogback, xml)
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
    var exists = false
    list.forEach(element => {
        if (element.ATTR.name == name) { exists = true }
    })
    return exists
}
function getLogger(loggerName, logLevel) {
    return {
        logger: {
            ATTR: { name: loggerName },
            level: [{ ATTR: { value: logLevel } }]
        }
    }
}

function getAppender(appenderName) {
    return {
        "appender": {
            "ATTR": {
                "name": appenderName,
                "class": "ch.qos.logback.core.rolling.RollingFileAppender"
            },
            "File": [
                "${artifactory.home}/logs/" + `${appenderName}.log`
            ],
            "encoder": [
                {
                    "pattern": [
                        "%date ${artifactory.contextId}[%thread] [%-5p] \\(%-20c{3}:%L\\) - %m%n"
                    ]
                }
            ],
            "rollingPolicy": [
                {
                    "ATTR": {
                        "class": "ch.qos.logback.core.rolling.FixedWindowRollingPolicy"
                    },
                    "FileNamePattern": [
                        "${artifactory.home}/logs/" + `${appenderName}.%i.log`
                    ],
                    "maxIndex": [
                        "13"
                    ]
                }
            ],
            "triggeringPolicy": [
                {
                    "ATTR": {
                        "class": "ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy"
                    },
                    "MaxFileSize": [
                        "10MB"
                    ]
                }
            ]
        }
    }
}

module.exports = {
    addLogger: addLogger,
    removeLogger: removeLogger,
    changeLogLevel: changeLogLevel
}