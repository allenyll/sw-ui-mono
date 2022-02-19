import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'authToken'

const UID_KEY = 'uid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeUID() {
  return Cookies.remove(UID_KEY)
}
