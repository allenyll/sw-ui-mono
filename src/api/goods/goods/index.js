import request from '@/utils/request'

const path = '/goods/'

export function getGoodsList(param) {
  return request({
    url: path + 'getGoodsList',
    method: 'post',
    data: param
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

export function updateLabel(params) {
  return request({
    url: path + 'updateLabel',
    method: 'post',
    data: params
  })
}

export function createGoods(param) {
  return request({
    url: path + 'createGoods',
    method: 'post',
    data: param
  })
}

export function updateGoods(id, param) {
  return request({
    url: path + 'updateGoods/' + id,
    method: 'post',
    data: param
  })
}

export function getSnowFlakeId() {
  return request({
    url: path + 'getSnowFlakeId',
    method: 'post'
  })
}

export function importGoods(data) {
  return request({
    url: path + 'importGoods',
    method: 'post',
    data: {
      goodsList: data
    }
  })
}
