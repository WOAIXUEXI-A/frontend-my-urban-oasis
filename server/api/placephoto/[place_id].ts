import axios from 'axios'
import baseapi from '~/server/api/baseapi'
const baseUrl = baseapi.baseUrl

export default defineEventHandler(async (event) => {
  const placeid = getRouterParam(event, 'place_id')

  const url = `${baseUrl}/place/photo/${placeid}`
  const res = await axios.get(url)
  return res.data
})
