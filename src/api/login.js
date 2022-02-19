import request from '@/utils/request'

// const path = '/api-uac/uac'
const path = '/user'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: path + '/auth',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: path + '/getUserInfo',
    method: 'get',
    params: { token }
  })
}

