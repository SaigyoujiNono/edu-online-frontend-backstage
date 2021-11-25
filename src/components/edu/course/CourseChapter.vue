<template>
  <div class="course-chapter-container">
    <el-button type="primary" class="header-btn" icon="el-icon-edit" @click="addChapterDialog">添加章节</el-button>
    <el-collapse v-model="activeName">
      <el-card v-if="primaryChapter.length">
        <el-collapse-item v-for="(chapter,index) in primaryChapter" :key="chapter.id" :name="index+1+''">
          <template slot="title">
            <h2 style="display: inline-block">{{ chapter.title }}</h2>
            <el-button type="primary" class="title-btn" size="mini" icon="el-icon-edit" @click.stop="editChapter(index)">编辑</el-button>
            <el-button type="primary" class="title-btn" size="mini" icon="el-icon-circle-plus-outline" @click.stop="addVideoDialog(index)">添加小节</el-button>
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定要删除这个章节吗？如果该章节下存在小节将无法删除"
              @onConfirm="removeChapter(index)"
            >
              <el-button slot="reference" type="danger" class="title-btn" size="mini" icon="el-icon-delete" @click.stop>删除</el-button>
            </el-popconfirm>
          </template>
          <el-card v-for="(video,vi) in chapter.children" :key="video.id" class="second-video" shadow="hover">
            <el-button v-if="video.isFree" type="success" size="mini" style="margin-right: 10px;" circle>免费</el-button>
            <h2 style="display: inline-block">{{ video.title }}</h2>
            <el-button v-if="video.videoSourceId" size="mini" class="is-upload-video" type="success" icon="el-icon-check" circle />
            <el-button v-else type="danger" size="mini" class="is-upload-video" icon="el-icon-close" circle />
            <el-button type="text" class="video-btn" size="mini" @click.stop="editVideoDialog(index,vi)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定要删除这个小节吗？"
              @onConfirm="removeVideo(index, vi)"
            >
              <el-button slot="reference" type="text" style="color: red" class="video-btn" size="mini">删除</el-button>
            </el-popconfirm>
          </el-card>
        </el-collapse-item>
      </el-card>
    </el-collapse>
    <!--添加章节的对话框-->
    <el-dialog
      :title="isUpdate ? '修改章节' : '添加章节'"
      :visible.sync="ChapterDialogVisible"
      width="30%"
    >
      <el-form label-width="80px" :model="chapterInfo">
        <el-form-item label="章节标题">
          <el-input v-model="chapterInfo.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapterInfo.sort" label="章节排序" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ChapterDialogVisible = false">取 消</el-button>
        <el-button v-if="!isUpdate" type="primary" @click="addChapter">确 定</el-button>
        <el-button v-if="isUpdate" type="primary" @click="editChapterSave">确定更新</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="VideoDialog.title"
      :visible.sync="VideoDialogVisible"
      width="30%"
    >
      <el-form label-width="80px" :model="chapterInfo">
        <el-form-item label="小节名称">
          <el-input v-model="videoInfo.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="videoInfo.sort" label="章节排序" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio v-model="videoInfo.isFree" :label="true">免费</el-radio>
          <el-radio v-model="videoInfo.isFree" :label="false">收费</el-radio>
        </el-form-item>
        <el-form-item v-if="videoInfo.id" label="添加视频">
          <el-upload
            :action="actionUrl"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :on-success="successHandler"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="videoInfo.fileList"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <div slot="tip" class="el-upload__tip">只能上传flv/mp4文件，且不超过100MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="VideoDialogVisible = false">取 消</el-button>
        <el-button v-if="!isUpdate" type="primary" @click="addVideo">确 定</el-button>
        <el-button v-if="isUpdate" type="primary" @click="editVideoConfirm">确定保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addChapter,
  addVideo,
  deleteChapter,
  deleteVideo, deleteVideoSave,
  editChapter,
  editVideo,
  getAllChapterInfo
} from '@/api/course'

function sortByProps(props) {
  return function(val1, val2) {
    const v1 = val1[props]
    const v2 = val2[props]
    return v1 - v2
  }
}
class ChapterTemplate {
  id = null
  title = null
  sort = 0
  children = []
}

class VideoTemplate {
  id = null
  title = null
  sort = 0
  isFree = true
  videoSourceId = null
  videoOriginalName = null
  duration = null
  status = null
  fileList = []
}
export default {
  name: 'CourseChapter',
  props: {
    courseId: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      actionUrl: process.env.VUE_APP_BASE_API + '/eduvod/video/uploadVideo',
      VideoDialog: {
        title: '',
        index: null,
        videoIndex: null
      },
      primaryChapterIndex: null,
      isUpdate: false,
      chapterInfo: { // 章节
        id: null,
        title: null,
        sort: 0,
        children: []
      },
      videoInfo: { // 小节
        id: null,
        title: null,
        isFree: true, // 1代表免费 0代表收费
        sort: 0,
        videoSourceId: null, // 云端视频资源
        videoOriginalName: null, // 原始文件名称
        duration: null,
        size: null,
        status: null,
        fileList: []
      },
      ChapterDialogVisible: false,
      VideoDialogVisible: false,
      activeName: ['1'],
      primaryChapter: []
    }
  },
  watch: {
    courseId() {
      // 获取所有章节与小节的信息
      getAllChapterInfo(this.courseId).then(res => {
        this.primaryChapter = res.data.chapterInfo
      })
    }
  },
  created() {
    if (this.courseId) {
      getAllChapterInfo(this.courseId).then(res => {
        this.primaryChapter = res.data.chapterInfo
      })
    }
  },
  methods: {
    // 视频上传start
    // 移除前
    beforeRemove(file, fileList) {
      return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    // 上传成功钩子
    successHandler(res, file) {
      this.videoInfo.videoSourceId = res.data.videoId
      this.videoInfo.videoOriginalName = file.name
      this.videoInfo.size = file.size
      this.videoInfo.videoOriginalName = file.name
      editVideo(this.videoInfo).then(() => {
        this.videoInfo.fileList.push({ name: file.name })
      })
    },
    // 限制视频个数
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '一个小节只能上传一个视频'
      })
    },
    // 移除函数
    handleRemove(file) {
      deleteVideoSave(this.videoInfo.id).then(() => {
        this.videoInfo.videoSourceId = null
        this.videoInfo.videoOriginalName = null
        this.videoInfo.duration = null
        this.videoInfo.size = null
        this.$message({
          type: 'warning',
          message: `移除了${file.name}`
        })
        editVideo(this.videoInfo)
      })
    },
    // 上传前
    beforeUpload(file) {
      // console.log(file.name)
    },
    // 视频上传end
    // 添加小节的对话框
    addVideoDialog(index) {
      this.isUpdate = false
      this.videoInfo = new VideoTemplate()
      this.VideoDialog.title = this.primaryChapter[index].title
      this.VideoDialog.index = index
      this.VideoDialogVisible = true
    },
    // 编辑小节的对话框
    editVideoDialog(primary, videoIndex) {
      this.isUpdate = true
      this.VideoDialog.title = '编辑小节'
      this.VideoDialogVisible = true
      this.videoInfo = { ...this.primaryChapter[primary].children[videoIndex] }
      // this.videoInfo.videoOriginalName = 'wdnmd'
      // 先判断该小节的videoOriginalName是否有值
      if (this.videoInfo.videoSourceId) {
        this.videoInfo.fileList = [{ name: this.videoInfo.videoOriginalName }]
      } else {
        this.videoInfo.fileList = []
      }
      this.VideoDialog.index = primary
      this.VideoDialog.videoIndex = videoIndex
    },
    // 编辑小节确认
    editVideoConfirm() {
      editVideo(this.videoInfo).then(res => {
        this.primaryChapter[this.VideoDialog.index].children[this.VideoDialog.videoIndex] = { ...this.videoInfo }
      }).finally(() => {
        if (this.primaryChapter[this.VideoDialog.index].children.length > 1) {
          this.sortBySort(this.primaryChapter[this.VideoDialog.index].children)
        }
        this.VideoDialogVisible = false
      })
    },
    // 添加小节
    addVideo() {
      const video = { ...this.videoInfo }
      video.courseId = this.courseId
      video.chapterId = this.primaryChapter[this.VideoDialog.index].id
      addVideo(video).then(res => {
        video.id = res.data.video.id
        if (!this.primaryChapter[this.VideoDialog.index].children) {
          this.primaryChapter[this.VideoDialog.index].children = []
        }
        this.primaryChapter[this.VideoDialog.index].children.push(video)
      }).finally(() => {
        if (this.primaryChapter[this.VideoDialog.index].children && this.primaryChapter[this.VideoDialog.index].children.length > 1) {
          this.sortBySort(this.primaryChapter[this.VideoDialog.index].children)
        }
        this.VideoDialogVisible = false
      })
    },
    // 删除小节
    removeVideo(primaryIndex, videoIndex) {
      deleteVideo(this.primaryChapter[primaryIndex].children[videoIndex].id).then(res => {
        this.$message({
          type: 'success',
          message: this.primaryChapter[primaryIndex].children[videoIndex].title + '小节删除成功'
        })
        this.primaryChapter[primaryIndex].children.splice(videoIndex, 1)
      })
    },
    // 添加章节的窗口打开
    addChapterDialog() {
      this.chapterInfo = { ...new ChapterTemplate() }
      this.isUpdate = false
      this.ChapterDialogVisible = true
    },
    // 编辑章节的窗口打开
    editChapter(index) {
      this.isUpdate = true
      this.ChapterDialogVisible = true
      this.chapterInfo = { ...this.primaryChapter[index] }
      this.primaryChapterIndex = index
    },
    // 添加章节
    addChapter() {
      const chapterAdd = { ...this.chapterInfo }
      chapterAdd.courseId = this.courseId
      addChapter(chapterAdd).then(res => {
        const chapter = { ...res.data.chapter }
        this.primaryChapter.push(chapter)
        // 如果当前长度大于1则进行排序
        if (this.primaryChapter.length > 1) {
          this.sortBySort(this.primaryChapter)
        }
      }).finally(() => {
        this.ChapterDialogVisible = false
      })
    },
    // 删除章节
    removeChapter(index) {
      deleteChapter(this.primaryChapter[index].id).then(res => {
        this.$message({
          type: 'success',
          message: this.primaryChapter[index].title + '删除成功'
        })
        this.primaryChapter.splice(index, 1)
      })
    },
    // 编辑章节
    editChapterSave() {
      editChapter(this.chapterInfo).then(res => {
        this.primaryChapter[this.primaryChapterIndex] = { ...this.chapterInfo }
        // 如果当前长度大于1则进行排序
        if (this.primaryChapter.length > 1) {
          this.sortBySort(this.primaryChapter)
        }
      }).finally(() => {
        this.ChapterDialogVisible = false
      })
    },
    // 排序方法
    sortBySort(arr) {
      arr.sort(sortByProps('sort'))
    }
  }
}
</script>

<style scoped>
.title-btn{
  margin-left: 20px;
}
.course-chapter-container{
  padding: 10px;
}
.header-btn{
  margin: 10px;
}
.second-video{
  margin-left: 20px;
}
.video-btn{
  margin-left: 20px;
}
.is-upload-video{
  margin-left: 10px;
}
</style>
