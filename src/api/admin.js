import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'POST',
    data
  })
}

export function listAdmin(params) {
  return request({
    url: '/admin/list',
    method: 'GET',
    params
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'POST',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/update',
    method: 'PUT',
    data
  })
}

export function deleteAdmin(id) {
  return request({
    url: `/admin/delete/${id}`,
    method: 'DELETE'
  })
}
