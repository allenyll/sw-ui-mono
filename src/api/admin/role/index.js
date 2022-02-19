import request from '@/utils/request'

const path = '/role/'

export function page(query) {
  return request({
    url: path + 'page',
    method: 'get',
    params: query
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

export function delObj(id) {
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

export function setMenus(id, obj) {
  return request({
    url: path + 'setMenus',
    method: 'post',
    data: {
      'ids': obj,
      'id': id
    }
  })
}

export function getRoleMenus(id) {
  return request({
    url: path + 'getRoleMenus/' + id,
    method: 'get'
  })
}
