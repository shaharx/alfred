const im = require('./instanceManager')
const ls = require('./log-system')

function setHA(options) {
    var propsFile = createHaNodeProperties(options.parameters)
    im.write(getHANodePropertiesFile(options.path), propsFile)
}

const getHANodePropertiesFile = (path) => {
    return path + im.getPath().haNodeProperties
}

function createHaNodeProperties(properties) {
    var propsFile = ''
    var propsArray = properties.split(' ')
    propsArray.forEach(element => {
        propsFile += element + '\n'
    })
    return propsFile
}

function getTemplate() {
    return require('../templates/ha-build-script').tempStr
}

module.exports = {
    setHA: setHA,
    getTemplate: getTemplate
}

// alfred ha set -o "node.id=art1 context.url=http://localhost:8081/artifactory/ membership.port=0 primary=true"