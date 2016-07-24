import { meta } from '../utils/config'
import { log } from '../utils/emit'
import { cloudFormation } from '../utils/aws'

export default async function (argv) {
  const CF = cloudFormation()

  log('Destroying AWS Resources (this may take awhile)')

  const StackName = `transit-${await meta.get('appName')}`
  await CF.deleteStack({ StackName }).promise()

  await meta.set('stackCreated', false)
  await CF.waitFor('stackDeleteComplete', { StackName }).promise()

  log('Resources destroyed!')
}
