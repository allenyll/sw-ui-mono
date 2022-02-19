import request from '@/utils/request'

const path = '/sku/'

export function list() {
  return request({
    url: path + 'list',
    method: 'post'
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

export function getSkuStockList(id, params) {
  return request({
    url: path + 'getSkuStockList/' + id,
    method: 'post',
    data: params
  })
}

export function updateSkuStock(id, params) {
  return request({
    url: path + 'updateSkuStock/' + id,
    method: 'post',
    data: params
  })
}
