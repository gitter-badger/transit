import chalk from 'chalk'

export function log (msg) {
  console.log(`=> ${msg}`)
}

export function error (err, fatal = true) {
  console.error(chalk.red(err.message || err))
  if (fatal) process.exit(1)
}
