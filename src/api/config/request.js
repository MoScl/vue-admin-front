import axios from 'axios'
import ApiInterceptors from './apiInterceptors'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  timeout: 300000
})

request.interceptors.request.use(...ApiInterceptors.appendBaseParams)
request.interceptors.response.use(...ApiInterceptors.flattenResponse)

export default request
