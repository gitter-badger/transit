import path from 'path'
import fs from 'fs-promise'
import deepAssign from 'deep-assign'
import { ensureJson } from './common'

let baseConfig = {
  bundlesDir: path.resolve('.transit/bundles'),
  metadataFile: path.resolve('.transit/metadata.json'),
  // resourcesFile: path.resolve('.transit/resources.json'),
  envFile: path.resolve('env.json'),
  env: {},
  babel: {},
  aws: {
    region: 'us-east-1'
  }
}

export async function setupConfig (argv) {
  /* get config options from package file */
  const pkgFile = path.resolve('package.json')
  const pkg = await fs.exists(pkgFile)
    ? await fs.readJson(pkgFile, 'utf8') : {}
  deepAssign(baseConfig, pkg.transit)

  /* ensure defaults for stuff */
  await fs.ensureDir(baseConfig.bundlesDir)
  // await ensureJson(baseConfig.resourcesFile, {})
  await ensureJson(baseConfig.metadataFile, {
    appName: pkg.name || `transit-${Math.floor((Math.random() * 99999) + 10000)}`,
    stackCreated: false
  })

  /* get babel config */
  const babelrc = path.resolve('.babelrc')
  baseConfig.babel = await fs.exists(babelrc)
    ? await fs.readJson(babelrc, 'utf8') : (pkg.babel || {})

  /* setup environment variables */
  const envFileExists = await fs.exists(baseConfig.envFile)
  if (envFileExists) {
    baseConfig.env = await fs.readJson(baseConfig.envFile)
  } else if (!envFileExists && !baseConfig.envFile.match(/\/env.json$/)) {
    throw new Error(`"${baseConfig.envFile}" was not found`)
  }
}

export const meta = {
  async get (key) {
    const data = await fs.readJson(baseConfig.metadataFile)
    return data[key]
  },

  async set (key, value) {
    const data = await fs.readJson(baseConfig.metadataFile)
    data[key] = value

    await fs.writeJson(baseConfig.metadataFile, data)
  }
}

export default () => baseConfig
