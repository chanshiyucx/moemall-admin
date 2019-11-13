import request from '@/utils/request'

export function listAttributeIdList(id) {
  return request({
    url: `/productAttribute/attrInfo/${id}`,
    method: 'GET'
  })
}

export function listWithAttrAttributeCategory(params) {
  return request({
    url: '/productAttribute/category/listWithAttr',
    method: 'GET',
    params
  })
}

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

export function listAttribute(params) {
  return request({
    url: '/productAttribute/list',
    method: 'GET',
    params
  })
}

export function createAttribute(data) {
  return request({
    url: '/productAttribute/create',
    method: 'POST',
    data
  })
}

export function updateAttribute(data) {
  return request({
    url: '/productAttribute/update',
    method: 'PUT',
    data
  })
}

export function deleteAttribute(id) {
  return request({
    url: `/productAttribute/delete/${id}`,
    method: 'DELETE'
  })
}
