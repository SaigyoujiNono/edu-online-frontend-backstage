<template>
  <div>
    <el-upload
      drag
      :action="actionUrl"
      multiple
      :on-success="uploadSuccessful"
    >
      <img :src="url" class="img-show" alt="图片">
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
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
      actionUrl: '/oss/file/imgUpload'
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
  width: 360px;
}
</style>
