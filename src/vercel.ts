import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const { VERCEL_DEPLOY_HOOK_ID } = process.env

const deploy = async () => {
  const { data } = await axios.post(
    `https://api.vercel.com/v1/integrations/deploy/${VERCEL_DEPLOY_HOOK_ID}`
  )
  return data
}

export default { deploy }
