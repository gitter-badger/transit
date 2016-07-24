import { meta } from '../utils/config'
import { cloudFormation } from '../utils/aws'

export default async function (argv) {
  const CF = cloudFormation()

  const StackName = `bunda--${await meta.get('appName')}`
  await CF.deleteStack({ StackName }).promise()

  await meta.set('stackCreated', false)
  await CF.waitFor('stackDeleteComplete', { StackName }).promise()
}
