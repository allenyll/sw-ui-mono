import request from '@/utils/request'

const path = '/order/'

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
export function deleteOrder(params) {
  return request({
    url: path + 'deleteOrder',
    method: 'post',
    params: params
  })
}

export function closeOrder(params) {
  return request({
    url: path + 'closeOrder',
    method: 'post',
    params: params
  })
}

export function deliveryOrder(params) {
  return request({
    url: path + 'deliveryOrder',
    method: 'post',
    params: params
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/orderDetail/getOrderDetail/' + id,
    method: 'post'
  })
}

export function updateReceiverInfo(params) {
  return request({
    url: path + 'updateReceiverInfo',
    method: 'post',
    params: params
  })
}

export function updateMoneyInfo(params) {
  return request({
    url: path + 'updateMoneyInfo',
    method: 'post',
    params: params
  })
}

export function updateOrderNote(params) {
  return request({
    url: path + 'updateOrderNote',
    method: 'post',
    params: params
  })
}

export function cancelOrder(params) {
  return request({
    url: path + 'cancelOrder',
    method: 'post',
    params: params
  })
}

export function putObj(id, obj) {
  return request({
    url: path + id,
    method: 'put',
    data: obj
  })
}
