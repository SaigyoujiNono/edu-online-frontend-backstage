<template>
  <div class="course-cover">
    <el-upload
      :action="actionUrl"
      multiple
      :on-success="uploadSuccessful"
    >
      <img :src="url" class="img-show" alt="图片">
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    url: {
      type: String,
      default: 'https://mqd-online-edu.oss-cn-guangzhou.aliyuncs.com/2021/10/22/eaeb3bc929b34ef486447c9ab84f85ef.png'
    }
  },
  data() {
    return {
      actionUrl: process.env.VUE_APP_BASE_API + '/oss/file/imgUpload'
    }
  },
  methods: {
    uploadSuccessful(response, file, fileList) {
      this.$emit('img-upload', response.data.url)
    }
  }
}
</script>

<style scoped>
.img-show{
  width: 480px;
  height: 360px;
}
</style>
