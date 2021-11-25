/**
 * banner后端接口api
 */
import request from '@/utils/request'

// 添加一个banner到数据库
export function addBanner(banner) {
  return request({
    url: '/cmsservice/banner/banner',
    method: 'post',
    data: {
      ...banner
    }
  })
}

// 删除一个banner
export function delBanner(id) {
  return request({
    url: '/cmsservice/banner/banner/' + id,
    method: 'delete'
  })
}

// 修改banner信息
export function updateBanner(banner) {
  return request({
    url: '/cmsservice/banner/banner',
    method: 'put',
    data: {
      ...banner
    }
  })
}

// 条件查询banner
export function getBanner(options) {
  return request({
    url: '/cmsservice/banner/banner',
    method: 'get',
    params: {
      ...options
    }
  })
}
