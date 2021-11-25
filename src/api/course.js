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

// 删除课程信息
export function delCourseInfo(id) {
  return request({
    url: '/eduservice/course/courseInfo/' + id,
    method: 'delete'
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
export function deleteChapter(chapterId) {
  return request({
    url: '/eduservice/chapter/chapter/' + chapterId,
    method: 'delete'
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

// 根据id删除小节
export function deleteVideo(videoId) {
  return request({
    url: '/eduservice/video/video/' + videoId,
    method: 'delete'
  })
}

// 修改小节信息
export function editVideo(video) {
  return request({
    url: '/eduservice/video/video/',
    method: 'put',
    data: {
      ...video
    }
  })
}

// 删除小节中的视频存储
export function deleteVideoSave(id) {
  return request({
    url: `/eduservice/video/videoSingle/${id}`,
    method: 'delete'
  })
}

// 获取发布前的课程基本信息
export function getBeforePublishCourse(courseId) {
  return request({
    url: '/eduservice/course/publishCourse/' + courseId,
    method: 'get'
  })
}

// 确认发布课程
export function publishCourse(status) {
  return request({
    url: `/eduservice/course/publish/${status.pub}/${status.id}`,
    method: 'put'
  })
}

// 根据条件查询获取课程列表
export function getCourseList(query) {
  return request({
    url: '/eduservice/course/getCourseList',
    method: 'get',
    params: {
      ...query
    }
  })
}
