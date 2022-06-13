import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: '/admin',
  timeout: 3000
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(function (response) {
  const data = response.data
  if (data.code === 200 || data.code === 20000) {
    return data
  } else {
    return Promise.reject(data.message)
  }
}, function (error) {
  return Promise.reject(error)
})
export default request
