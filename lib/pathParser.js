function parse(path) {
    var newPath = path ? path : require('./manager').getDefaultServerPath()
    if (newPath == '') {
        console.log('No default server path found, please set it or use the -p flag to work from a specific directory')
        process.exit()
    }
    newPath = newPath[0] != '/' ? `${process.cwd()}/${newPath}` : newPath
    newPath = newPath[newPath.length - 1] != '/' ? newPath : newPath.substring(0, newPath.length - 1)

    return newPath
}

module.exports = { parse }