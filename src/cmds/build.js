import path from 'path'
import fs from 'fs-promise'
import config from '../core/config'
import bundle from '../core/bundle'

export default async function (argv) {
  const funcs = argv._.slice(1)

  await Promise.all(funcs.map(async (func) => {
    const funcName = path.basename(func)
    const handler = path.resolve(func, 'index.js')

    if (!await fs.exists(handler)) {
      throw new Error(`Could not find index.js for "${func}"`)
    }

    const output = `${path.resolve(config().bundlesDir, path.basename(func))}.zip`
    const savedFile = await bundle(handler, output)

    console.log(`saved to ${savedFile}`)
  }))
}
