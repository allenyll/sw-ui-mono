import request from '@/utils/request'

const path = '/file/'

export function getFileList(param) {
  return request({
    url: path + 'getFileList',
    method: 'post',
    params: param
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

export function delFile(param) {
  return request({
    url: path + 'delFile',
    method: 'post',
    params: param
  })
}

export function upload(file) {
  return request({
    url: path + 'upload',
    method: 'post',
    data: file
  })
}

export function download(file) {
  return request({
    url: path + 'download?fileUrl=' + file,
    method: 'post'
  })
}

export function removeFileById(id) {
  return request({
    url: path + 'removeFileById?fileId=' + id,
    method: 'get'
  })
}
