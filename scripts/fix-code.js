const fs = require('fs')
const path = require('path')

const file = path.resolve(__dirname, '../dist/index.js')

let code = fs.readFileSync(file, 'utf-8')

code = code.replace(
  'watchCompilerHost.watchFile = ',
  `
  watchCompilerHost.watchFile = (() => {}) ||
  `
)
code = code.replace(
  'watchCompilerHost.watchDirectory = ',
  `
  watchCompilerHost.watchDirectory = (() => {}) ||
  `
)
code = code.replace(`_interopDefault(require('glob'))`, '{sync() {}}')
code = code.replace(`_interopDefault(require('chokidar'))`, '{watch() {}}')

fs.writeFileSync(file, code)
