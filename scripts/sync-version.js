const path = require('path')
const readPkgUp = require('read-pkg-up')
const writePackage = require('write-pkg')

;(async () => {
  const main = require.resolve('@typescript-eslint/typescript-estree')
  const cwd = path.dirname(main)
  const {
    packageJson: {version},
  } = await readPkgUp({cwd, normalize: false})

  const {packageJson} = await readPkgUp({ normalize: false})

  await writePackage({
    ...packageJson,
    version
  }, { normalize: false})
})()