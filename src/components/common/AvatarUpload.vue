<template>
  <div>
    <div class="avatar-container">
      <img :src="avatar" class="avatar-show" alt="图片">
    </div>
    <el-upload
      class="upload-demo"
      drag
      :action="avatarAction"
      multiple
      :on-success="uploadSuccessful"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'AvatarUpload',
  props: {
    avatarAction: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  methods: {
    uploadSuccessful(response, file, fileList) {
      this.$emit('upload-successful', response.data.url)
    }
  }
}
</script>

<style scoped>
.avatar-show{
  width: 200px;
  height: 200px;
  border-radius: 50%;
  transition-duration: 0.5s;
}
.avatar-show:hover{
  width: 235px;
  height: 235px;
  transform: rotate(360deg);
}
.avatar-container{
  text-align: center;
  vertical-align: middle;
  display: table-cell;
  height: 250px;
  width: 250px;
}
</style>
