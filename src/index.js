import minimist from 'minimist'
import chalk from 'chalk'
import { setupConfig } from './utils/config'

export default async function () {
  try {
    /* parse arguments into config */
    const argv = minimist(process.argv.slice(2))
    await setupConfig(argv)

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
      default:
        console.log(`"${cmd}" is not a valid command`)
        break
    }
  } catch (err) {
    console.error(chalk.red(err.message || err))
    process.exit(1)
  }
}
