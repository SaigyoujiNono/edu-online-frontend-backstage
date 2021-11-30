import request from '@/utils/request'

const baseURL = '/edu/admin/user'

export function login(data) {
  return request({
    url: baseURL + '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: baseURL + '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: baseURL + '/logout',
    method: 'post'
  })
}
