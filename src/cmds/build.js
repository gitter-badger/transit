import path from 'path'
import fs from 'fs-promise'
import chalk from 'chalk'
import browserify from 'browserify'
import babelify from 'babelify'
import envify from 'envify/custom'
import uglifyify from 'uglifyify'
import archiver from 'archiver'
import config from '../utils/config'
import { log } from '../utils/emit'

export default async function (argv) {
  const funcs = argv._.slice(1)
  if (!funcs.length) throw new Error('No functions were specified!')

  await Promise.all(funcs.map(async (func) => {
    const handler = path.resolve(func, 'index.js')

    if (!await fs.exists(handler)) {
      throw new Error(`Could not find index.js for "${func}"`)
    }

    const outputFile = `${path.resolve(config().bundlesDir, path.basename(func))}.zip`
    await bundle(handler, outputFile)

    log(`${chalk.yellow(func)} was built`)
  }))
}

async function bundle (entry, output) {
  /* initialize browserify bundle */
  const b = browserify({
    entries: [entry],
    standalone: 'lambda',
    browserField: false,
    builtins: false,
    commondir: false,
    ignoreMissing: true,
    detectGlobals: true,
    insertGlobalVars: {
      // https://github.com/substack/node-browserify/issues/1277
      process: () => {}
    }
  })
    /* transpile ES6 */
    .transform(babelify, config().babel)
    /* inline environment variables into source */
    .transform(envify(config().env))
    /* basic minification */
    .transform({ global: true }, uglifyify)

  /* add bundle stream to zip archive */
  const archive = archiver.create('zip', {})
  archive.append(b.bundle(), { name: '_index.js' })

  /* add function wrapper */
  const wrapperFile = path.resolve(__dirname, '../utils/wrapper.js')
  archive.append(fs.createReadStream(wrapperFile), { name: 'index.js' })

  /* pipe archive out to a file */
  const stream = fs.createWriteStream(output)
  archive.finalize().pipe(stream)

  /* wait for zip file stream to close */
  const name = await new Promise((resolve, reject) => {
    const outputName = output.replace(`${config().bundlesDir}/`, '')

    stream.on('error', reject)
    stream.on('close', () => resolve(outputName))
  })

  return name
}
