import path from 'path'
import fs from 'fs-promise'
import { meta } from '../utils/config'
import { log } from '../utils/emit'
import { cloudFormation } from '../utils/aws'

export default async function (argv) {
  if (await meta.get('stackCreated')) {
    throw new Error('Stack was already created')
  }

  const templatePath = path.resolve(__dirname, '../../assets/cloudformation.json')
  const template = await fs.readJson(templatePath)

  const CF = cloudFormation()

  log('Creating AWS Resources (this may take awhile)')

  const StackName = `transit-${await meta.get('appName')}`
  const TemplateBody = JSON.stringify(template)

  await CF.createStack({
    StackName, TemplateBody,
    Capabilities: ['CAPABILITY_IAM']
  }).promise()

  await meta.set('stackCreated', true)
  await CF.waitFor('stackCreateComplete', { StackName }).promise()

  log('Resources created!')
}
