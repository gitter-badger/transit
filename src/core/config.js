import path from 'path'
import fs from 'fs-promise'

let baseConfig = {
  configDir: path.resolve('.bunda'),
  bundlesDir: path.resolve('.bunda/bundles'),
  envFile: 'env.json'
}

export async function setupConfig (argv) {
  await fs.ensureDir(baseConfig.configDir)
  await fs.ensureDir(baseConfig.bundlesDir)

  const pkgFile = path.resolve('package.json')
  const pkg = await fs.exists(pkgFile)
    ? await fs.readJson(pkgFile, 'utf8') : {}

  const babelrc = path.resolve('.babelrc')
  baseConfig.babel = await fs.exists(babelrc)
    ? await fs.readJson(babelrc, 'utf8') : (pkg.babel || {})

  baseConfig = { ...baseConfig, ...pkg.bunda }
}

export default () => baseConfig

// const config = {
//   inputDir: null,
//   envFile: null,
//   outputFile: null
// }
//
// export function getConfigFromArgv (argv) {
//   config.envFile = path.resolve(argv.env || argv.e || '.env')
//
//   const defaultInput = `${process.cwd()}/functions`
//   config.inputDir = path.resolve(argv.dir || argv.d || defaultInput)
//
//   const defaultOutput = `${path.basename(config.inputDir)}.zip`
//   config.outputFile = path.resolve(argv.output || argv.o || defaultOutput)
// }
//
// export default config
