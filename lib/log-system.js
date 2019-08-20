const chalk = require('chalk')

function log (message) {
    console.log(chalk.green(message))
}

function warn (message) {
    console.log(chalk.yellow(message))
}

function error (message) {
    console.log(chalk.red(message))
}

module.exports = {
    log: log,
    warn: warn,
    error, error
}