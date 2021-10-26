import request from '@/utils/request'

export function getTeacher(current, size = 10, query) {
  let url = '/eduservice/teacher/teacher'
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
    url: '/eduservice/teacher/teacher',
    method: 'post',
    data: {
      ...teacher
    }
  })
}
export function updateTeacher(teacher) {
  return request({
    url: '/eduservice/teacher/teacher',
    method: 'put',
    data: {
      ...teacher
    }
  })
}

export function deleteTeacher(id) {
  return request({
    url: `/eduservice/teacher/teacher/${id}`,
    method: 'delete'
  })
}

export function getTeacherAll() {
  return request({
    url: '/eduservice/teacher/teacherAll',
    method: 'get'
  })
}
