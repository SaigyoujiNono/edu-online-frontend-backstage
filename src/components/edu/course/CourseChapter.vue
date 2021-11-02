<template>
  <div class="course-chapter-container">
    <el-button type="primary" class="header-btn" icon="el-icon-edit" @click="addChapterDialog">添加章节</el-button>
    <el-collapse v-model="activeName">
      <el-collapse-item v-for="(chapter,index) in primaryChapter" :key="chapter.id" :name="index+1+''">
        <template slot="title">
          <h1 style="display: inline-block">{{ chapter.title }}</h1>
          <el-button type="primary" class="title-btn" size="mini" icon="el-icon-edit" @click.stop="editChapter(index)">编辑</el-button>
          <el-button type="primary" class="title-btn" size="mini" icon="el-icon-circle-plus-outline" @click.stop="addVideoDialog(index)">添加小节</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定要删除这个章节吗？如果该章节下存在小节将无法删除"
            @onConfirm="removeChapter()"
          >
            <el-button slot="reference" type="danger" class="title-btn" size="mini" icon="el-icon-delete" @click.stop>删除</el-button>
          </el-popconfirm>
        </template>
        <el-card v-for="video in chapter.children" :key="video.id" class="second-video" shadow="hover">
          <h2 style="display: inline-block">{{ video.title }}</h2>
          <el-button type="text" class="video-btn" size="mini" @click.stop="editChapter(index)">编辑</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定要删除这个小节吗？"
            @onConfirm="removeChapter()"
          >
            <el-button slot="reference" type="text" style="color: red" class="video-btn" size="mini">删除</el-button>
          </el-popconfirm>
        </el-card>
      </el-collapse-item>
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
        <el-form-item label="添加小节">
          <el-input v-model="videoInfo.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="videoInfo.sort" label="章节排序" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="VideoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVideo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addChapter, getAllChapterInfo } from '@/api/course'

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
      VideoDialog: {
        title: '',
        index: null
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
        sort: 0
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
  },
  methods: {
    removeChapter() {
      console.log('aaa')
    },
    // 添加小节的对话框
    addVideoDialog(index) {
      this.videoInfo = new VideoTemplate()
      this.VideoDialog.title = this.primaryChapter[index].title
      this.VideoDialog.index = index
      this.VideoDialogVisible = true
    },
    // 添加小节
    addVideo() {
      const video = { ...this.videoInfo }
      this.primaryChapter[this.VideoDialog.index].children.push(video)
      if (this.primaryChapter[this.VideoDialog.index].children.length > 1) {
        this.sortBySort(this.primaryChapter[this.VideoDialog.index].children)
      }
      this.VideoDialogVisible = false
    },
    // 添加章节的窗口打开
    addChapterDialog() {
      this.chapterInfo = { ...new ChapterTemplate() }
      this.isUpdate = false
      this.ChapterDialogVisible = true
    },
    // 编辑章节
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
        this.primaryChapter.push(chapterAdd)
        // 如果当前长度大于1则进行排序
        if (this.primaryChapter.length > 1) {
          this.sortBySort(this.primaryChapter)
        }
        this.ChapterDialogVisible = false
      }).catch(() => {
        this.ChapterDialogVisible = false
      })
    },
    // 编辑章节
    editChapterSave() {
      this.primaryChapter[this.primaryChapterIndex] = { ...this.chapterInfo }
      // 如果当前长度大于1则进行排序
      if (this.primaryChapter.length > 1) {
        this.sortBySort(this.primaryChapter)
      }
      this.ChapterDialogVisible = false
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
</style>
