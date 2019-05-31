function checkVersion(source, target, action) {
    source = source.split('.')
    target = target.split('.')

    switch (action) {
        case 'upgrade':
            if ((source[0] < target[0]) || (source[1] < target[1]) || (source[2] < target[2])) {
                console.log('Version is valid, can upgrade')
                return true
            } else {
                console.log(`Cannot upgrade to an earlier version`)
                return false
            }
        case 'downgrade':
            if ((source[0] > target[0]) || (source[1] > target[1]) || (source[2] > target[2])) {
                console.log('Version is valid, can downgrade')
                return true
            } else {
                console.log(`Cannot downgrade to a later version`)
                return false
            }
    }


    // sort wheter its an upgrade or a downgrade version check
}

// checkVersion('4.0.2', '4.0.1', 'downgrade')

module.exports = {checkVersion}