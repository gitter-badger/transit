import minimist from 'minimist'
import { error } from './utils/emit'
import { setupConfig } from './utils/config'
import pkg from '../package.json'

export default async function () {
  try {
    /* parse arguments into config */
    const argv = minimist(process.argv.slice(2), {
      boolean: ['h', 'help', 'v', 'version']
    })

    /* parse config values */
    await setupConfig(argv)

    /* allow help flag on any command */
    if (argv.help || argv.h) {
      argv._.unshift('help')
    }

    /* show version number */
    if (argv.version || argv.v) {
      return console.log(`v${pkg.version}`)
    }

    /* run command based off of first arg */
    const cmd = argv._[0]
    switch (cmd) {
      case 'init':
        await require('./cmds/init').default(argv)
        break
      case 'destroy':
        await require('./cmds/destroy').default(argv)
        break
      case 'build':
        await require('./cmds/build').default(argv)
        break
      case 'help':
      case undefined:
        await require('./cmds/help').default(argv)
        break
      default:
        error(`"${cmd}" is not a valid command`)
        break
    }
  } catch (err) {
    error(err)
  }
}
