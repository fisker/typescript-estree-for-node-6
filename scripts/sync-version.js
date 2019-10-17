const path = require('path')
const readPackageUp = require('read-pkg-up')
const writePackage = require('write-pkg')

;

(async () => {
  const main = require.resolve('@typescript-eslint/typescript-estree')
  const cwd = path.dirname(main)
  const {
    packageJson: {version},
  } = await readPackageUp({cwd, normalize: false})

  const {packageJson} = await readPackageUp({normalize: false})

  await writePackage(
    {
      ...packageJson,
      version,
    },
    {normalize: false}
  )
})()
