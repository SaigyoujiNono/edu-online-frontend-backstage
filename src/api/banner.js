/**
 * banner后端接口api
 */
import request from '@/utils/request'
const baseURL = '/cms/admin'
// 添加一个banner到数据库
export function addBanner(banner) {
  return request({
    url: baseURL + '/banner',
    method: 'post',
    data: {
      ...banner
    }
  })
}

// 获取单个banner的信息
export function getBannerById(id) {
  return request({
    url: baseURL + `/banner/${id}`,
    method: 'get'
  })
}

// 删除一个banner
export function delBanner(id) {
  return request({
    url: baseURL + '/banner/' + id,
    method: 'delete'
  })
}

// 修改banner信息
export function updateBanner(banner) {
  return request({
    url: baseURL + '/banner',
    method: 'put',
    data: {
      ...banner
    }
  })
}

// 条件查询banner
export function getBanner(options) {
  return request({
    url: baseURL + '/banner',
    method: 'get',
    params: {
      ...options
    }
  })
}
