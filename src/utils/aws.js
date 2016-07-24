import Aws from 'aws-sdk'
import config from './config'

export function cloudFormation () {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = config().env
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('Could not find AWS credentials')
  }

  Aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: config().aws.region
  })

  return new Aws.CloudFormation()
}
