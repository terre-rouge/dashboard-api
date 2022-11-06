import algoliasearch from 'algoliasearch'
import * as dotenv from 'dotenv'

dotenv.config()

const { ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_PROD } = process.env

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY)
const index = client.initIndex(ALGOLIA_INDEX_PROD)

const convertToRecords = (products: any) =>
  products.map((edge: any) => {
    const { node: product } = edge
    return {
      objectID: product.id,
      title: product.title,
      description: product.description,
      category: product.productType,
      tags: product.tags,
      handle: product.handle,
      price: product.priceRange.minVariantPrice.amount / 100, // Bug: API send in centimes
      currency: product.priceRange.minVariantPrice.currencyCode,
      image: product.images.edges[0]?.node?.transformedSrc,
    }
  })

const saveRecords = (records: any) =>
  index.saveObjects(records, {
    autoGenerateObjectIDIfNotExist: true,
  })

const saveProducts = async (products: any) => {
  const algoliaRecords = convertToRecords(products)
  const { objectIDs } = await saveRecords(algoliaRecords)
  return objectIDs
}

export default { saveProducts }
