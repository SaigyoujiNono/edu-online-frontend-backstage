<template>
  <el-card v-if="beforePublishCourse" class="course-card">
    <div class="before-container">
      <el-image style="width: 400px;height: 300px;" :src="beforePublishCourse.cover" />
      <div class="course-info">
        <h1>{{ beforePublishCourse.title }}</h1>
        <div>
          讲师: {{ beforePublishCourse.teacherName }}
        </div>
        分类: {{ beforePublishCourse.subjectParentName }} -- {{ beforePublishCourse.subjectName }} <br>
        价格: <span style="font-size: 18px;color: red;">￥ {{ beforePublishCourse.price }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CoursePublish',
  props: {
    beforePublishCourse: {
      default: null,
      type: Object
    }
  }
}
</script>

<style scoped>
.before-container{
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}
.course-card{
  margin: 5% 40px 5% 40px;
}
.course-info{
  font-size: 1.2em;
}
</style>
