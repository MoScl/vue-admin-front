import { ElMessage } from 'element-plus'
// import { getToken } from '@plugin/icss-plugin/lib/utils/auth'
// import store from '@/store'

const ApiInterceptors = {
  appendBaseParams: [
    config => {
      // put, post, patch 请求参数放到 data 中.
      if (
        ['PUT', 'POST', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())
      ) {
        if (config.data && config.data.constructor === FormData) {
          config.headers['Content-Type'] = 'multipart/form-data'
        } else {
          config.headers['Content-Type'] = 'application/json'
          config.data = {
            ...config.params,
            ...config.data
          }
        }
      }

      // do something before request is sent
      if (config.Authorization) {
        // let each request carry token
        config.headers['token'] = config.Authorization
      }
      // else if (getToken()) {
        // let each request carry token
        // config.headers['token'] = getToken()
      // }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  ],
  flattenResponse: [
    response => {
      // 跳过带附件（下载文件）的请求
      if (response.headers['content-disposition']) {
        return response.data
      } else {
        const { code, msg } = response.data
        if (code === 200) {
          return response.data
        } else if (code === 999) {
          // store.dispatch('global/expireToken')
        } else {
          ElMessage.error(msg.substring(0, 200) || '接口返回错误code')
          return Promise.reject(response.data)
        }
      }
    },
    error => {
      ElMessage.error('接口异常')
      return Promise.reject(error)
    }
  ]
}

export default ApiInterceptors
