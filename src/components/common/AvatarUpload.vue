<template>
  <div class="avatar-container">
    <img :src="avatar" class="avatar-show" alt="图片" @click="openCropper">
    <el-dialog
      title="上传头像"
      :visible.sync="cropperVisible"
      width="800px"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <div class="cropper">
        <VueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :center-box="option.centerBox"
          :info-true="option.infoTrue"
          :fixed-box="option.fixedBox"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-upload
          class="line-element"
          :multiple="false"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadPS"
          action=""
        ><el-button type="primary">选择图片</el-button></el-upload>
        <el-button @click="cropperVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadImgPS">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { verifyImgType } from '@/utils/validate'
import { uploadImg } from '@/api/oss'
import { convertBase64UrlToBlob } from '@/utils/imgHandler'
export default {
  name: 'AvatarUpload',
  components: { VueCropper },
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
  data() {
    return {
      cropperVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [5, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    }
  },
  methods: {
    uploadImgPS() {
      this.cropperVisible = false
      this.$refs.cropper.getCropData(data => {
        const file = convertBase64UrlToBlob(data)
        uploadImg(file, this.avatarAction).then(res => {
          this.uploadSuccessful(res)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    beforeAvatarUploadPS(file) {
      this.option.img = URL.createObjectURL(file)
      if (!verifyImgType(file)) return false
      return false
    },
    openCropper() {
      this.cropperVisible = true
    },
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
  box-shadow: 0 0 5px rgba(0,0,0,.8);
}
.avatar-container{
  text-align: center;
  vertical-align: middle;
  display: table-cell;
  height: 250px;
  width: 250px;
}
.cropper{
  width: auto;
  height: 600px;
}
.line-element{
  display: inline-block;
  margin-right: 10px;
}
</style>
