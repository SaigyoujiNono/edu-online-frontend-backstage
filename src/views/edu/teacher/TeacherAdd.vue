<template>
  <div class="app-container">
    <TeacherTemplate ref="teacherTemplate" />
    <el-button type="primary" @click="onSubmit('teacher')">立即创建</el-button>
    <el-button>取消</el-button>
  </div>
</template>

<script>
import TeacherTemplate from '@/components/edu/teacher/TeacherTemplate'
export default {
  components: { TeacherTemplate },
  data() {
    return {
      teacher: {
        name: null,
        intro: null,
        career: null,
        level: '1',
        avatar: 'https://mqd-online-edu.oss-cn-guangzhou.aliyuncs.com/2021/10/22/eaeb3bc929b34ef486447c9ab84f85ef.png',
        sort: '0'
      }
    }
  },
  methods: {
    onSubmit(t) {
      this.$refs.teacherTemplate.onSubmit(t)
    },
    uploadSuccessful(response) {
      this.teacher.avatar = response.data.url
      this.$message({
        message: '上传成功',
        type: 'success' })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
