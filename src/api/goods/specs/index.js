import request from '@/utils/request'

const path = '/specs/'

export function getSpecsList() {
  return request({
    url: path + 'list',
    method: 'post'
  })
}

export function getSpecsListCondition(condition) {
  return request({
    url: path + 'getSpecsListCondition',
    method: 'post',
    params: condition
  })
}

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
