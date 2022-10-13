/**
 * 往本地缓存中存储数据，可以同时传入多个需要存储的数据
 * @param {*} key
 * @param {*} value
 */
export function setLocalStorage(key, value) {
  if (typeof key === 'string') {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  } else if (typeof key === 'object' && !(key instanceof Array)) {
    const itemArr = Object.keys(key)
    itemArr.forEach((item) => {
      setLocalStorage(item, key[item])
    })
  } else {
    throw new Error('Invalid localStorage key or value')
  }
}

/**
 * 从本地缓存中获取数据
 * @param {*} key
 */
export function getLocalStorage(key) {
  if (!key || typeof key !== 'string') {
    throw new Error('localStorage required a string key')
  } else {
    return localStorage[key]
  }
}

/**
 * 从本地缓存中获取数据
 * @param {*} key
 */
export function removeLocalStorage(key) {
  if (!key) {
    throw new Error('localStorage required a key')
  } else {
    if (key instanceof Array) {
      key.forEach((item) => {
        removeLocalStorage(item)
      })
    } else if (typeof key === 'string') {
      localStorage.removeItem(key)
    } else {
      throw new Error('localStorage required a invalid key, you can give an array or string param')
    }
  }
}

// 本地储存方法
export function getSessionItem(key) {
  let value
  try {
    value = sessionStorage.getItem(key)
    return JSON.parse(value)
  } catch (ex) {
    // 开发环境下提示error
    // if (process.env.NODE_ENV === 'development') {
    //   console.error('localStorage.getSessionItem报错, ', ex.message);
    // }
  }
}

export function setSessionItem(key, value) {
  try {
    // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (ex) {
    // 开发环境下提示 error
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('localStorage.setSessionItem报错, ', ex.message);
    // }
  }
}

export function removeSessionItem(key) {
  sessionStorage.removeItem(key)
}

// 本地cookie储存方法
export function getCookieItem(key) {
  var arrStr = document.cookie.split('; ')
  for (var i = 0; i < arrStr.length; i++) {
    var temp = arrStr[i].split('=')
    if (temp[0] === key) return decodeURI(temp[1])
  }
}

export function setCookieItem(key, value, time) {
  var str = key + '=' + decodeURIComponent(value)
  if (time) { // 为0时不设定过期时间，浏览器关闭时cookie自动消失
    var date = new Date()
    var ms = time * 60 * 60 * 1000 // 自己设置cookie时间，time为小时数
    date.setTime(date.getTime() + ms)
    str += '; expires=' + date.toUTCString()
  } else {
    str += '; expires='
  }
  document.cookie = str + '; path=/'
}

export function removeCookieItem(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; path=/`
}
