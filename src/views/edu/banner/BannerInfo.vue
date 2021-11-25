<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="bannerInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="bannerInfo.title" />
      </el-form-item>
      <el-form-item label="跳转地址" prop="linkUrl">
        <el-input v-model="bannerInfo.linkUrl" />
      </el-form-item>
      <el-form-item label="图片" prop="imageUrl">
        <img width="600px" height="300px" :src="bannerInfo.imageUrl" alt="">
        <br>
        <el-button type="primary" @click="openCropper">上传</el-button>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="bannerInfo.sort" :min="0" label="排序" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="上传头像"
      :visible.sync="cropperVisible"
      width="80%"
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
      <div slot="footer" class="dialog-footer">
        <el-upload
          class="upload-btn"
          :multiple="false"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadPS"
          action=""
        >
          <el-button type="primary">选择图片</el-button>
        </el-upload>
        <el-button @click="cropperVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadImg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { verifyImgType } from '@/utils/validate'
import { convertBase64UrlToBlob } from '@/utils/imgHandler'
import { uploadImg } from '@/api/oss'
export default {
  name: 'BannerInfo',
  components: {
    VueCropper
  },
  data() {
    return {
      bannerInfo: {
        title: null,
        imageUrl: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.L3qRUIu3UjB3Dp0sUOFcgQHaDJ?w=337&h=148&c=7&r=0&o=5&pid=1.7',
        linkUrl: null,
        sort: 0
      },
      imgAction: '/oss/file/imgUpload',
      rules: {
        title: [
          { required: true, message: '必须填入标题', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ],
        linkUrl: [
          { type: 'url', message: '必须是一个url', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '必须上传图片', trigger: 'blur' },
          { type: 'url', message: '必须是一个url', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序', trigger: 'blur' },
          { min: 0, message: '不能小于0', trigger: 'blur' }
        ]
      },
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
    // 提交表单
    submitForm() {},
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开图片上传插件
    openCropper() {
      this.cropperVisible = true
    },
    // uploadImg
    uploadImg() {
      this.cropperVisible = false
      this.$refs.cropper.getCropData(data => {
        const file = convertBase64UrlToBlob(data)
        uploadImg(file, this.imgAction).then(res => {
          this.bannerInfo.imageUrl = res.data.url
        }).catch(err => {
          console.log(err)
        })
      })
    },
    beforeAvatarUploadPS(file) {
      this.option.img = URL.createObjectURL(file)
      if (!verifyImgType(file)) return false
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper{
  width: 90%;
  height:800px;
  margin: 0 auto;
}
.dialog-footer{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .upload-btn{
    margin-right: 10px;
  }
}
</style>
