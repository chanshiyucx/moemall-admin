import request from '@/utils/request'

export function listBrand(params) {
  return request({
    url: '/brand/list',
    method: 'GET',
    params
  })
}

export function createBrand(data) {
  return request({
    url: '/brand/create',
    method: 'POST',
    data
  })
}

export function updateBrand(data) {
  return request({
    url: '/brand/update',
    method: 'PUT',
    data
  })
}

export function updateBrandStatus(data) {
  return request({
    url: '/brand/update/status',
    method: 'PUT',
    data
  })
}

export function deleteBrand(id) {
  return request({
    url: `/brand/delete/${id}`,
    method: 'DELETE'
  })
}
