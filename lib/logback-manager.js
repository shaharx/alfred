const fs = require('fs')
const manager = require('./manager')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })

const getLogbackPath = (path) => {
    return `${path}/etc/logback.xml`
}
const logbackSnippetsPath = () => {
    return manager.getDirectories().logback
}

function addLogger(path, loggerName) {
    logbackFilePath = getLogbackPath(path)
    var logbackfile = fs.readFileSync(logbackFilePath, 'utf8')

    parser.parseString(logbackfile, (error, logbackResult) => {
        logbackResult.configuration.logger.forEach(element => {
            if (element.ATTR.name == loggerName) {
                loggerJson = logbackResult.logger
                console.log(`logger ${loggerName} already exist in the logback.xml file`)
                process.exit(0)
            }
        })
        console.log(`the logger ${loggerName} was not found`)
        var loggerSnippetsPath = `${logbackSnippetsPath()}/loggers`
        var loggerSnippets = []
        try {
            loggerSnippets = fs.readdirSync(loggerSnippetsPath)
        } catch (e){
            console.log(`The folder ${loggerSnippetsPath} does not exist, please download it using 'alfred logback dl' or get it manually and add it to ${logbackSnippetsPath()}`)
        }
        loggerSnippets.forEach(file => {
            if(!file.includes('.xml')){
                console.log(`File ${file} is a corrupted or is not an xml file`)
                return
            }
            var loggerFile = fs.readFileSync(`${loggerSnippetsPath}/${file}`, 'utf8')
            parser.parseString(loggerFile, function (err, loggerResult) {
                if(loggerName == loggerResult.logger.ATTR.name){
                    logbackResult.configuration.logger.push(loggerResult.logger)
                    console.log(loggerResult.logger.appender-ref)
                    
                }
            })
        })
    })
}

module.exports = { addLogger }