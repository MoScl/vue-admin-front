import { getCookieItem, setCookieItem, removeCookieItem } from './storage'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './storage'

const TokenKey = 'Authorization'
const OAuthKey = 'OAuth'
const UserInfoKey = 'userInfo'

export function getToken() {
  return getCookieItem(TokenKey)
}

export function setToken(token) {
  return setCookieItem(TokenKey, token)
}

export function removeToken() {
  return removeCookieItem(TokenKey)
}

export function getOAuth() {
  return getLocalStorage(OAuthKey)
}

export function setOAuth(oauth) {
  return setLocalStorage(OAuthKey, oauth)
}

export function removeOAuth() {
  return removeLocalStorage(OAuthKey)
}

export function getUserInfo() {
  return getLocalStorage(UserInfoKey)
}

export function setUserInfo(userInfo) {
  return setLocalStorage(UserInfoKey, userInfo)
}

export function removeUserInfo() {
  return removeLocalStorage(UserInfoKey)
}
