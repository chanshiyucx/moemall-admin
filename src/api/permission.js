import request from '@/utils/request'

export function listPermission() {
  return request({
    url: '/permission/treeList',
    method: 'GET'
  })
}

export function createPermission(data) {
  return request({
    url: '/permission/create',
    method: 'POST',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/update',
    method: 'PUT',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: `/permission/delete/${id}`,
    method: 'DELETE'
  })
}
