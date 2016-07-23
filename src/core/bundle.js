import path from 'path'
import fs from 'fs-promise'
import minimist from 'minimist'
import browserify from 'browserify'
import babelify from 'babelify'
import envify from 'envify/custom'
import uglifyify from 'uglifyify'
import archiver from 'archiver'
import config from '../core/config'

export default async function (entry, output) {
  /* make sure environment vars file exists */
  const envFileExists = await fs.exists(config().envFile)
  if (!envFileExists && config().envFile !== 'env.json') {
    throw new Error(`"${config().envFile}" was not found`)
  }

  /* get environment variables */
  const envData = envFileExists ? await fs.readJson(config().envFile) : {}

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
    .transform(envify(envData))
    /* basic minification */
    .transform({ global: true }, uglifyify)

  /* add bundle stream to zip archive */
  const archive = archiver.create('zip', {})
  archive.append(b.bundle(), { name: '_index.js' })

  /* add function wrapper */
  const wrapperFile = path.resolve(__dirname, 'wrapper.js')
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
