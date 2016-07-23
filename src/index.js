import minimist from 'minimist'
import { setupConfig } from './core/config'

export default async function () {
  try {
    /* parse arguments into config */
    const argv = minimist(process.argv.slice(2))
    await setupConfig(argv)

    /* run command based off of first arg */
    const cmd = argv._[0]
    switch (cmd) {
      case 'build':
        await require('./cmds/build').default(argv)
        break
      default:
        console.log(`"${cmd}" is not a valid command`)
        break
    }
  } catch (err) {
    console.error(err)
  }
}
