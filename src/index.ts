import express from 'express'

import algolia from './algolia'
import shopify from './shopify'
import vercel from './vercel'
import jwtCheck from './jwt-checker'

const app = express()

app.use(jwtCheck)

app.get('/status', async (req, res) => {
  res.send('Online')
  res.end()
})

// Deploy website
app.get('/deploy', async (req, res) => {
  try {
    // 1. Load products from Shopify
    console.log('[SHOPIFY] Exporting products...')
    const products = await shopify.getProducts()
    console.log(`[SHOPIFY] ${products.length} products loaded !`)

    // 2. Export them into Algolia
    console.log('[ALGOLIA] Importing products...')
    const ids = await algolia.saveProducts(products)
    console.log(`[ALGOLIA] ${ids.length} records created !`)

    // 3. Deploy website with vercel
    console.log('[VERCEL] Starting deployment...')
    const response = await vercel.deploy()
    console.log('[VERCEL] New deployment triggered !')

    res.send(response)
  } catch (error) {
    console.log('error', error)
    res.status(500)
    res.send(error.message)
  }
  res.end()
})

const server = app.listen(6000, () => {
  console.log('App is listening on port 6000')
})

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

function shutDown() {
  server.close(() => {
    process.exit(0)
  })

  setTimeout(() => {
    process.exit(1)
  }, 10000)
}
