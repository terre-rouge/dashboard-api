import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import * as dotenv from 'dotenv'

dotenv.config()

const { AUTH0_JWKS_URI, AUTH0_AUDIENCE, AUTH0_ISSUER } = process.env

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_ISSUER,
  algorithms: ['RS256'],
})

export default jwtCheck
