import request from '@/utils/request'

export function getSubjectTree() {
  return request({
    url: '/eduservice/subject/tree',
    method: 'get'
  })
}

export function getSubject(wrapper) {
  return request({
    url: '/eduservice/subject/subject',
    method: 'get',
    params: {
      ...wrapper
    }
  })
}

export function addSubject(sub) {
  return request({
    url: '/eduservice/subject/subject',
    method: 'post',
    data: {
      ...sub
    }
  })
}

export function delSubject(id) {
  return request({
    url: `/eduservice/subject/subject/${id}`,
    method: 'delete'
  })
}
