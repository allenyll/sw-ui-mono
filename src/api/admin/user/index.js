import request from '@/utils/request'

const path = '/user/'

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

export function getDepotObj(id) {
  return request({
    url: '/depot/' + id,
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

export function getRoleList(id) {
  return request({
    url: '/role/getRoleList/' + id,
    method: 'get'
  })
}

export function setRoles(id, obj) {
  return request({
    url: path + 'setRoles',
    method: 'post',
    data: {
      'ids': obj,
      'id': id
    }
  })
}

export function updateStatus(params) {
  return request({
    url: path + 'updateStatus',
    method: 'post',
    data: params
  })
}

