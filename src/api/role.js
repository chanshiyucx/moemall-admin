import request from '@/utils/request'

export function listRole() {
  return request({
    url: '/role/list',
    method: 'GET'
  })
}

export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'POST',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'PUT',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/delete/${id}`,
    method: 'DELETE'
  })
}
