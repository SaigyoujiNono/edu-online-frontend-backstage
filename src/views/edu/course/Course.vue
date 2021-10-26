<template>
  <div class="app-container">
    <div v-if="!ifIdExist">该id不存在</div>
    <div v-if="ifIdExist">
      <el-steps :active="active" finish-status="success">
        <el-step title="填写课程信息" />
        <el-step title="填写课程大纲" />
        <el-step title="最终发布" />
      </el-steps>
      <course-info v-if="active===0" ref="info" @info-upload="infoUpload" />
      <course-chapter v-if="active===1" ref="chapter" />
      <course-publish v-if="active===2" ref="publish" />
      <el-button v-if="active>0 && active<3" style="width: 200px;margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button type="primary" style="width:200px; margin-top: 12px;" @click="next">
        {{
          active >= 2 ? active === 3 ? '发布成功查看' : '发布' : '保存并下一步'
        }}
      </el-button>
    </div>
  </div>
</template>

<script>
import CourseInfo from '@/components/edu/course/CourseInfo'
import CourseChapter from '@/components/edu/course/CourseChapter'
import CoursePublish from '@/components/edu/course/CoursePublish'
export default {
  name: 'CourseAdd',
  components: { CoursePublish, CourseChapter, CourseInfo },
  data() {
    return {
      ifIdExist: true,
      active: null,
      id: null
    }
  },
  created() {
    const id = this.$route.params.id
    const step = this.$route.params.step
    if (!id && !step) {
      this.active = 0
    } else {
      if (step > 3 || step < 0) {
        this.$router.push('/404')
      }
      this.active = step * 1
      this.id = id
    }
  },
  methods: {
    next() {
      if (this.active === 3) {
        this.$router.push('/')
      } else if (this.active < 3) {
        if (this.active === 0) {
          this.$refs.info.submitForm()
        } else if (this.active === 1) {
          this.$router.push(`/course/info/${this.active + 1}/${this.id}`)
        }
      }
    },
    previous() {
      if (this.active > 0) {
        this.$router.push(`/course/info/${this.active - 1}/${this.id}`)
      }
    },
    infoUpload() {
      this.$router.push(`/course/info/${this.active + 1}/${this.id}`)
    }
  }
}
</script>

<style scoped>

</style>
