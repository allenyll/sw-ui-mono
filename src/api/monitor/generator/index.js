import request from '@/utils/request'

const path = '/generator/'

export function page(query) {
  return request({
    url: path + 'getTableListByPage',
    method: 'get',
    params: query
  })
}

export function generator(obj) {
  return request({
    url: path + 'code',
    method: 'post',
    data: obj,
    responseType: 'blob'
  })
}

