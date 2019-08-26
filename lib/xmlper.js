const fs = require('fs')
const manager = require('./manager')
const instanceManager = require('./instanceManager')
const ls = require('./log-system')

const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: "ATTR" })
var builder = new xml2js.Builder({ attrkey: "ATTR" })