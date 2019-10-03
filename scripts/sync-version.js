const path = require('path')
const readPkgUp = require('read-pkg-up')
const writePackage = require('write-pkg')

;(async () => {
  const main = require.resolve('@typescript-eslint/typescript-estree')
  const cwd = path.dirname(main)
  const {
    packageJson: {version},
  } = await readPkgUp({cwd})

  const {packageJson} = await readPkgUp()

  await writePackage({
    ...packageJson,
    version
  })
})()