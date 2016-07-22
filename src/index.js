import path from 'path'
import fs from 'fs'
import minimist from 'minimist'
import browserify from 'browserify'
import babelify from 'babelify'
import envify from 'envify/custom'
import uglifyify from 'uglifyify'
import archiver from 'archiver'
import zoo from 'zoo'

export default function () {
  const argv = minimist(process.argv.slice(2))

  const inputDir = path.resolve(argv.dir || argv.d)
  const envFile = path.resolve(argv.env || argv.e || '.env')

  const defaultOutput = path.basename(inputDir) + '.zip'
  const outputFile = path.resolve(argv.output || argv.o || defaultOutput)

  const envData = zoo.get(envFile)
  const b = browserify({
    entries: [path.resolve(inputDir, 'index.js')],
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
    .transform(babelify, { presets: ['es2015'] })
    .transform(envify(envData))
    .transform({ global: true }, uglifyify)

  const archive = archiver.create('zip', {})
  archive.append(b.bundle(), { name: 'index.js' })

  const stream = fs.createWriteStream(outputFile)
  archive.pipe(stream)
  archive.finalize()

  archive.on('error', (err) => console.log(err))
  stream.on('close', () => {
    const outputName = outputFile.replace(`${process.cwd()}/`, '')
    console.log(`=> Saved to ${outputName}`)
  })
}
