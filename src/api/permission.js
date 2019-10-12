import request from '@/utils/request'

export function listPermission() {
  return request({
    url: '/permission/treeList',
    method: 'get'
  })
}

export function createPermission(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/update',
    method: 'put',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: `/permission/delete/${id}`,
    method: 'delete'
  })
}
