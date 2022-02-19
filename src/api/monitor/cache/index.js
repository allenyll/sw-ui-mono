import request from '@/utils/request'

const path = '/cache/'

export function page(query) {
  return request({
    url: path + 'page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: path + 'remove/' + id,
    method: 'delete'
  })
}

export function delAllObj(id) {
  return request({
    url: path + 'removeAll',
    method: 'delete'
  })
}
