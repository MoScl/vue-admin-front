module.exports = {
  // 系统名称
  title: 'vue-admin-front',
  // 服务配置
  server: {
    name: 'unite',
    port: 8180,
    path: '/unite'
  },
  globalConfig: {
    // 是否开启国际化
    i18nEnable: false,
    // 免登录的返回登录页面
    loginURL: '/unite/login',
    // 是否开启面包屑
    hasBreadcrumbs: false

  }
}
