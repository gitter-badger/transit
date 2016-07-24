import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export default async function (argv) {
  const cmds = argv._.slice(1).join('__')
  console.log(menus[cmds] || menus['_default'])
}

export function getLogo (padCount = 0) {
  const logoFile = path.resolve(__dirname, '../../assets/logo.txt')
  const logo = fs.readFileSync(logoFile, 'utf8')

  /* dynamically generate left padding */
  const padding = new Array(padCount + 1).join(' ')
  return logo.split('\n').map((line) => `${padding}${line}`).join('\n')
}

export const menus = {
  _default: `${chalk.dim(getLogo(2))}
  ${chalk.underline('Usage:')}

    bunda <command> [options]

  ${chalk.underline('Commands:')}

    init               create AWS resources
    destroy            delete all AWS resources created
    build              process and bundle a function(s)
    help               show help menu for following command

  ${chalk.underline('Options:')}

    -h, --help         show help menu for a command
    -v, --version      show version number
  `,

  // -----------------------------------------------------------------------------

  init: 'init menu (todo)',

  // -----------------------------------------------------------------------------

  destroy: 'destroy menu (todo)',

  // -----------------------------------------------------------------------------

  build: 'build menu (todo)'
}
