function parseParameters(parameters) {
    var parametersKeyValue = parameters.split(' ')
    var parametersObject = {}
    for (i = 0; i < parametersKeyValue.length; i++) {
        parametersKeyValue[i] = parametersKeyValue[i].split('=')
    }
    parametersKeyValue.forEach(keyVal => {
        var element = { YALLA_BEITAR: keyVal[1] }
        element = JSON.parse(JSON.stringify(element).replace("YALLA_BEITAR", keyVal[0]))
        parametersObject = Object.assign(parametersObject, element)
    })
    return parametersList
}