import request from '@/utils/request'

export function addCourseInfo(info) {
  return request({
    url: '/eduservice/course/courseInfo',
    method: 'post',
    data: {
      ...info
    }
  })
}


export function getCourseInfo(option) {
  return request({
    url: '/eduservice/course/courseInfo',
    method: 'post',
    params: {
      ...option
    }
  })
}
