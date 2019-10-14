import request from '@/utils/request'

export function listRole() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/delete/${id}`,
    method: 'delete'
  })
}
