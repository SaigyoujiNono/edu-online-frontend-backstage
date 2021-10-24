import request from '@/utils/request'

export function getTeacher(current, size = 10, query) {
  let url = '/eduservice/teacher'
  if (current) {
    url += `/${current}`
  }
  return request({
    url: url,
    method: 'get',
    params: {
      pageSize: size,
      ...query
    }
  })
}

export function addTeacher(teacher) {
  return request({
    url: '/eduservice/teacher',
    method: 'post',
    data: {
      ...teacher
    }
  })
}
export function updateTeacher(teacher) {
  return request({
    url: '/eduservice/teacher',
    method: 'put',
    data: {
      ...teacher
    }
  })
}

export function deleteTeacher(id) {
  return request({
    url: `/eduservice/teacher/${id}`,
    method: 'delete'
  })
}
