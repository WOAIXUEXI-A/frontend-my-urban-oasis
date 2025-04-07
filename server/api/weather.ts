import axios from 'axios'
import baseapi from '~/server/api/baseapi'
const baseUrl = baseapi.baseUrl

export default defineEventHandler(async (event) => {
  const url = `${baseUrl}/weather/`
  const res = await axios.get(url)
  return res.data
})
