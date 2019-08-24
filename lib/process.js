const find = require('find-process')
const fs = require('fs')
const im = require('../lib/instanceManager')

const path = '/Users/shaharl/Projects/NodeJS/alfred/tests/artifactory-pro-6.9.1'

console.log(processIsRunning(path))

function processIsRunning(path) {
  const pidFilePath = `${path}${im.getPath().pid}`
  const pid = fs.readFileSync(pidFilePath, 'utf8')
  var exists = false
  console.log(path)
  find('pid', parseInt(pid))
    .then(function (list) {
      const parameter = `-Dartifactory.home=${path}`
      // var arr = list[0].cmd.split(' ')
      // console.log(arr)
      if(list[0].cmd.includes(parameter)){
        console.log('ok')
        exists = true
      }
      console.log(parameter)
    }, function (err) {
      console.log(err.stack || err);
    });
    console.log(exists)
    return exists
}