<template>
  <el-form ref="teacher" :model="teacher" :rules="rules" label-width="80px">
    <el-form-item label="讲师姓名" prop="name">
      <el-input
        v-model="teacher.name"
        type="text"
        placeholder="请输入姓名"
        maxlength="10"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="讲师简介" prop="intro">
      <el-input
        v-model="teacher.intro"
        type="textarea"
        placeholder="请输入介绍内容"
        maxlength="500"
        rows="12"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="讲师资历" prop="career">
      <el-input
        v-model="teacher.career"
        type="text"
        placeholder="一句话说明讲师"
        maxlength="255"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="讲师头衔" prop="level">
      <el-radio v-model="teacher.level" :label="1">高级讲师</el-radio>
      <el-radio v-model="teacher.level" :label="2">首席讲师</el-radio>
    </el-form-item>
    <el-form-item label="讲师头像">
      <AvatarUpload :avatar="teacher.avatar" :avatar-action="avatarAction" @upload-successful="uploadSuccessful" />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="teacher.sort" :min="0" :max="2" />
    </el-form-item>
  </el-form>
</template>

<script>
import AvatarUpload from '@/components/common/AvatarUpload'
import { addTeacher, updateTeacher } from '@/api/teacher'

export default {
  components: {
    AvatarUpload
  },
  props: {
    teacherProp: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      avatarAction: 'http://127.0.0.1:8002/oss/file/avatar',
      teacher: {
        id: null,
        name: null,
        intro: null,
        career: null,
        level: 1,
        avatar: 'https://mqd-online-edu.oss-cn-guangzhou.aliyuncs.com/2021/10/22/eaeb3bc929b34ef486447c9ab84f85ef.png',
        sort: null
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '必须输入' },
          { min: 3, max: 500, message: '必须输入，长度在1-500个字符之间', trigger: 'blur' }
        ],
        career: [
          { required: true, message: '必须输入', trigger: 'blur' }
        ],
        sort: [
          { type: 'number', required: true, message: '必须输入', trigger: 'blur' }
        ],
        level: [
          { type: 'number', required: true, message: '必须输入', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    teacherProp() {
      this.teacher = { ...this.teacherProp }
    }
  },
  created() {
    if (this.teacherProp) {
      this.teacher = { ...this.teacherProp }
    }
  },
  methods: {
    onSubmit(t) {
      this.$refs[t].validate((valid) => {
        if (valid) {
          addTeacher(this.teacher).then(() => {
            this.$router.push('/teacher/table')
          })
        } else {
          return false
        }
      })
    },
    onUpdate(t) {
      this.$refs[t].validate((valid) => {
        if (valid) {
          updateTeacher(this.teacher).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('update-successful')
          })
        } else {
          return false
        }
      })
    },
    uploadSuccessful(url) {
      this.teacher.avatar = url
    }
  }
}
</script>

<style>
</style>
