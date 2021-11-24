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
      default: 'https://img0.baidu.com/it/u=211849578,1713280059&fm=26&fmt=auto'
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
