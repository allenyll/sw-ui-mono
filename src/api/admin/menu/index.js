import request from '@/utils/request'

const path = '/menu/'

export function requestTree(query) {
  return request({
    url: path + 'getAllMenu',
    method: 'get',
    params: query
  })
}

export function getMenuTree(type) {
  return request({
    url: path + 'getMenuTree?type=' + type,
    method: 'get'
  })
}

export function requestAll() {
  return request({
    url: path + 'all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: path + 'add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: path + id,
    method: 'get'
  })
}

export function delObj(id, obj) {
  return request({
    url: path + id,
    method: 'delete',
    params: {
      eq_id: id
    }
  })
}

export function putObj(id, obj) {
  return request({
    url: path + id,
    method: 'put',
    data: obj
  })
}
