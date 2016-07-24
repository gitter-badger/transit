import Aws from 'aws-sdk'
import config from './config'

export function cloudFormation () {
  Aws.config.update({
    accessKeyId: config().env.AWS_ACCESS_KEY_ID,
    secretAccessKey: config().env.AWS_SECRET_ACCESS_KEY,
    region: config().aws.region
  })

  return new Aws.CloudFormation()
}
