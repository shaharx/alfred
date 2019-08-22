const ls = require('./log-system')

function checkVersion(source, target, action) {
    ls.log(`${source} - ${target} - ${action}`)
    source = source.split('.')
    target = target.split('.')
    
    switch (action) {
        case 'upgrade':
            if (parseInt(source[0]) < parseInt(target[0]) || parseInt(source[1]) < parseInt(target[1]) || parseInt(source[2]) < parseInt(target[2])) {
                return true
            } else {
                return false
            }
        case 'downgrade':
            if ((source[0] > target[0]) || (source[1] > target[1]) || (source[2] > target[2])) {
                ls.success('Version is valid, can downgrade')
                return true
            } else {
                ls.error(`Cannot downgrade to a later version`)
                return false
            }
    }


    // sort wheter its an upgrade or a downgrade version check
}

// checkVersion('4.0.2', '4.0.1', 'downgrade')

module.exports = { checkVersion }