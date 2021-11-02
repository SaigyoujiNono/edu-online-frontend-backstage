import request from '@/utils/request'

// 添加课程信息
export function addCourseInfo(info) {
  return request({
    url: '/eduservice/course/courseInfo',
    method: 'post',
    data: {
      ...info
    }
  })
}
// 更新课程信息
export function updateCourseInfo(info) {
  return request({
    url: '/eduservice/course/courseInfo',
    method: 'put',
    data: {
      ...info
    }
  })
}
// 获取课程信息
export function getCourseInfo(option) {
  return request({
    url: '/eduservice/course/courseInfo',
    method: 'get',
    params: {
      ...option
    }
  })
}

// 获取该课程所有章节和小节信息
export function getAllChapterInfo(id) {
  return request({
    url: '/eduservice/chapter/chapter/' + id,
    method: 'get'
  })
}

// 添加章节
export function addChapter(chapter) {
  return request({
    url: '/eduservice/chapter/chapter',
    method: 'post',
    data: {
      ...chapter
    }
  })
}

// 修改章节
export function editChapter(chapter) {
  return request({
    url: '/eduservice/chapter/chapter',
    method: 'put',
    data: {
      ...chapter
    }
  })
}

// 删除章节
export function deleteChapter(chapter) {
  return request({
    url: '/eduservice/chapter/chapter',
    method: 'delete',
    params: {
      ...chapter
    }
  })
}

// 添加小节
export function addVideo(video) {
  return request({
    url: '/eduservice/video/video',
    method: 'post',
    data: {
      ...video
    }
  })
}
