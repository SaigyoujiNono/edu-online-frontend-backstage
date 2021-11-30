import request from '@/utils/request'

const baseURL = '/edu/admin'

export function getTeacher(current, size = 10, query) {
  let url = baseURL + '/teacher'
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
    url: baseURL + '/teacher',
    method: 'post',
    data: {
      ...teacher
    }
  })
}
export function updateTeacher(teacher) {
  return request({
    url: baseURL + '/teacher',
    method: 'put',
    data: {
      ...teacher
    }
  })
}

export function deleteTeacher(id) {
  return request({
    url: baseURL + `/teacher/${id}`,
    method: 'delete'
  })
}

export function getTeacherAll() {
  return request({
    url: baseURL + '/teacherAll',
    method: 'get'
  })
}
