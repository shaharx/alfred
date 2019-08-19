const fs = require('fs')
const manager = require('./manager')
const chalk = require('chalk')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })

const logbackSnippetsPath = manager.getDirectories().logback

const getLogbackPath = (path) => {
    return `${path}/etc/logback.xml`
}
const logbackSnippetsPaths = () => {
    return paths = {
        loggers: `${logbackSnippetsPath}/loggers`,
        appenders: `${logbackSnippetsPath}/appenders`
    }
}

function addLogger(path, loggerName) {
    logbackFilePath = getLogbackPath(path)
    var logbackfile = fs.readFileSync(logbackFilePath, 'utf8')

    parser.parseString(logbackfile, (logbackError, logbackResult) => {
        if (logbackError) {
            console.log(logbackError)
        }
        logbackResult.configuration.logger.forEach(element => {
            if (element.ATTR.name == loggerName) {
                loggerJson = logbackResult.logger
                console.log(chalk.yellow(`logger ${loggerName} already exist in the logback.xml file`))
                process.exit(0)
            }
        })
        console.log(chalk.yellow(`the logger ${loggerName} was not found in the logback.xml file. adding.`))
        var loggerSnippetsPath = logbackSnippetsPaths().loggers
        var loggerSnippets = []
        try {
            loggerSnippets = fs.readdirSync(loggerSnippetsPath)
        } catch (e) {
            console.log(`The folder ${loggerSnippetsPath} does not exist, please download it using 'alfred logback dl' or get it manually and add it to ${logbackSnippetsPaths()}`)
        }
        loggerSnippets.forEach(file => {
            if (!file.includes('.xml')) {
                console.log(chalk.red(`File ${file} is a corrupted or is not an xml file`))
                return
            }
            try {
                var loggerFile = fs.readFileSync(`${loggerSnippetsPath}/${file}`, 'utf8')
            } catch (e) {
                console.log(`logger ${file} was not found`)
            }
            parser.parseString(loggerFile, (loggerError, loggerJson) => {
                if (loggerName == loggerJson.logger.ATTR.name) {
                    logbackResult.configuration.logger.push(loggerJson.logger)
                    console.log(chalk.green(`Successfully added the ${loggerName} to the logback.xml file`))
                    if (loggerFile.includes('appender-ref')) {
                        loggerFile = loggerFile.replace('appender-ref', 'appender_ref') // I hope this loggerFile won't be pushed again....
                        parser.parseString(loggerFile, (appenderError, corruptedResult) => {
                            if (appenderError) { console.log('Appender error: ' + appenderError) }
                            const appenderName = corruptedResult.logger.appender_ref[0].ATTR.ref
                            var appendersSnippetsPath = logbackSnippetsPaths().appenders
                            var appenderSnippets = []
                            try {
                                appenderSnippets = fs.readdirSync(appendersSnippetsPath)
                            } catch (e) {
                                console.log(`The folder ${appendersSnippetsPath} does not exist, please download it using 'alfred logback dl' or get it manually and add it to ${logbackSnippetsPaths()}`)
                            }
                            appenderSnippets.forEach(appender => {
                                if (!appender.includes('.xml')) {
                                    console.log(chalk.red(`File ${appender} is a corrupted or is not an xml file`))
                                    return
                                }
                                try {
                                    var appenderFile = fs.readFileSync(`${appendersSnippetsPath}/${appender}`, 'utf8')
                                } catch (e) {
                                    console.log(chalk.red(`appender ${appenderFile} was not found`))
                                }
                                parser.parseString(appenderFile, (appenderJsonError, appenderJSON) => {
                                    if (appenderJsonError) { console.log(appenderJsonError) }
                                    if (appenderName == appenderJSON.appender.ATTR.name) {
                                        logbackResult.configuration.appender.push(appenderJSON.appender)
                                        console.log(chalk.green(`Successfully added the ${appenderName} appender to the logback.xml file, data will be written to ${appenderJSON.appender.File[0]}`))
                                        var logbackFinalXml = builder.buildObject(logbackResult)
                                        fs.writeFileSync(logbackFilePath, logbackFinalXml)
                                    }
                                })
                            })
                        })
                    }
                }
            })
        })
    })
}

module.exports = { addLogger }