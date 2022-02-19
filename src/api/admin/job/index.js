import request from '@/utils/request'

const path = '/job/'

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

export function delObj(id, obj) {
  return request({
    url: path + 'deleteJob/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: path + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, flag) {
  const param = {
    'id': id,
    'flag': flag
  }
  return request({
    url: path + 'updateStatus',
    method: 'post',
    data: param
  })
}

export function executeJob(param) {
  return request({
    url: path + 'executeJob',
    method: 'post',
    data: param
  })
}

