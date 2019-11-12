import request from '@/utils/request'

export function listAttributeCategory(params) {
  return request({
    url: '/productAttribute/category/list',
    method: 'GET',
    params
  })
}

export function createAttributeCategory(data) {
  return request({
    url: '/productAttribute/category/create',
    method: 'POST',
    data
  })
}

export function updateAttributeCategory(id, data) {
  return request({
    url: `/productAttribute/category/update/${id}`,
    method: 'PUT',
    data
  })
}

export function deleteAttributeCategory(id) {
  return request({
    url: `/productAttribute/category/delete/${id}`,
    method: 'DELETE'
  })
}
