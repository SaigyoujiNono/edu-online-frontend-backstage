import request from '@/utils/request'
const baseURL = '/edu/admin'
export function getSubjectTree() {
  return request({
    url: baseURL + '/tree',
    method: 'get'
  })
}

export function getSubject(wrapper) {
  return request({
    url: baseURL + '/subject',
    method: 'get',
    params: {
      ...wrapper
    }
  })
}

export function addSubject(sub) {
  return request({
    url: baseURL + '/subject',
    method: 'post',
    data: {
      ...sub
    }
  })
}

export function delSubject(id) {
  return request({
    url: baseURL + `/subject/${id}`,
    method: 'delete'
  })
}
