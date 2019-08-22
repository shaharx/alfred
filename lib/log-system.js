const chalk = require('chalk')

function log(message) {
    console.log(message)
}

function success(message) {
    console.log(chalk.green(message))
}

function warn(message) {
    console.log(chalk.yellow(message))
}

function error(message) {
    console.log(chalk.red(message))
}

function progress(message) {
    console.log(chalk.blue(message))
}

module.exports = {
    log: log,
    warn: warn,
    error, error,
    success: success,
    progress: progress
}