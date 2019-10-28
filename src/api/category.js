import request from '@/utils/request'

export function listCategory(params) {
  return request({
    url: '/productCategory/list',
    method: 'GET',
    params
  })
}

export function createCategory(data) {
  return request({
    url: '/productCategory/create',
    method: 'POST',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/productCategory/update',
    method: 'PUT',
    data
  })
}

export function updateCategoryStatus(data) {
  return request({
    url: '/productCategory/update/status',
    method: 'PUT',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/productCategory/delete/${id}`,
    method: 'DELETE'
  })
}
