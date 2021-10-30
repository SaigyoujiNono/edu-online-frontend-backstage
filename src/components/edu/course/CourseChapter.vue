<template>
  <div class="course-chapter-container">
    <el-button type="primary" class="header-btn" icon="el-icon-edit" @click="addChapterDialog">添加章节</el-button>
    <el-button type="primary" class="header-btn" icon="el-icon-edit" @click="addChapter">保存章节</el-button>
    <el-collapse v-model="activeName">
      <el-collapse-item v-for="(chapter,index) in primaryChapter" :key="index" :name="index+1+''">
        <template slot="title">
          <h1>{{ index }}--{{ chapter.title }}</h1>
          <el-button type="primary" class="title-btn" size="mini" icon="el-icon-edit" @click.stop="editChapter(index)">编辑</el-button>
          <el-button type="primary" class="title-btn" size="mini" icon="el-icon-edit" @click.stop="addVideoDialog(index)">添加小节</el-button>
          <el-button type="primary" class="title-btn" size="mini" icon="el-icon-edit">删除</el-button>
        </template>
        <div v-for="(video,vi) in chapter.children" :key="vi">{{ vi }}--{{ video.title }}</div>
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
  methods: {
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
      this.primaryChapter.push(chapterAdd)
      // 如果当前长度大于1则进行排序
      if (this.primaryChapter.length > 1) {
        this.sortBySort(this.primaryChapter)
      }
      this.ChapterDialogVisible = false
    },
    // 编辑章节
    editChapterSave() {
      console.log('editChapterSave')
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
</style>
