const fs = require('fs')
const path = require('path')

const file = path.resolve(__dirname, '../dist/index.js')

let code = fs.readFileSync(file, 'utf-8')

// set watchCompilerHost.{watchFile, watchDirectory} to empty function
// avoid use chokidar
// code = code.replace(
//   'watchCompilerHost.watchFile = ',
//   'watchCompilerHost.watchFile = (() => {}) ||'
// )
// code = code.replace(
//   'watchCompilerHost.watchDirectory = ',
//   'watchCompilerHost.watchDirectory = (() => {}) ||'
// )

// fake glob module
code = code.replace(`require('glob')`, '{sync() {}}')

// remove `eslint-disable` comment
code = code.replace(/eslint-disable/g, 'eslint--disable')

fs.writeFileSync(file, code)
