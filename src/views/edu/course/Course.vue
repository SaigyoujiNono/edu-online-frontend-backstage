<template>
  <div class="app-container">
    <div v-if="!ifIdExist"><h1>页面不存在！</h1></div>
    <div v-if="ifIdExist">
      <el-steps :active="active">
        <el-step title="第一步" description="填写课程基本信息" />
        <el-step title="第二步" description="填写课程大纲" />
        <el-step title="第三步" description="最终发布" />
      </el-steps>
      <course-info v-if="active===1" ref="info" :course-info-update="courseInfoUpdate" @info-upload="infoUpload" />
      <course-chapter v-if="active===2" ref="chapter" :course-id="id" />
      <course-publish v-if="active===3" ref="publish" />
      <el-button v-if="active>1 && active<4" style="width: 200px;margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button type="primary" style="width:200px; margin-top: 12px;" @click="next">
        {{
          active >= 3 ? active === 3 ? '发布成功查看' : '发布' : '保存并下一步'
        }}
      </el-button>
    </div>
  </div>
</template>

<script>
import CourseInfo from '@/components/edu/course/CourseInfo'
import CourseChapter from '@/components/edu/course/CourseChapter'
import CoursePublish from '@/components/edu/course/CoursePublish'
import { getCourseInfo } from '@/api/course'
export default {
  name: 'Course',
  components: { CoursePublish, CourseChapter, CourseInfo },
  data() {
    return {
      courseInfoUpdate: null,
      ifIdExist: true,
      active: null,
      id: null
    }
  },
  created() {
    const id = this.$route.params.id
    const step = this.$route.params.step
    if (!id && !step) {
      this.active = 1
    } else {
      if (step > 3 || step < 0) {
        this.$router.push('/404')
      }
      this.active = step * 1
      // 获取id的信息
      getCourseInfo({ id: id }).then(res => {
        this.courseInfoUpdate = res.data.courseInfo
        this.id = this.courseInfoUpdate.id
      }).catch(() => {
        // 不存在这个id则重定向到正常页面
        this.$router.push('/course/info')
      })
    }
  },
  methods: {
    next() {
      if (this.active === 3) {
        this.$router.push('/')
      } else if (this.active === 1) {
        this.$refs.info.submitForm()
      } else if (this.active === 2) {
        this.$router.push(`/course/info/${this.active + 1}/${this.id}`)
      }
    },
    previous() {
      if (this.active > 0) {
        this.$router.push(`/course/info/${this.active - 1}/${this.id}`)
      }
    },
    infoUpload(id) {
      this.$router.push(`/course/info/${this.active + 1}/${id}`)
    }
  }
}
</script>

<style scoped>

</style>
