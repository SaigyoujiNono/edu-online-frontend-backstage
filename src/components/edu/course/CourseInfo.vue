<template>
  <el-form ref="courseInfo" v-loading="loading" label-width="100px" :model="courseInfo" :rules="rules">
    <el-form-item label="课程名称" prop="title">
      <el-input v-model="courseInfo.title" placeholder="请输入课程名称" />
    </el-form-item>
    <el-row>
      <el-form-item label="课程分类">
        一级分类
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择">
          <el-option
            v-for="item in subjectInfo.parent"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        二级分类
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="item in subjectInfo.children"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-form-item label="选择老师" prop="lessonNum">
      <el-select v-model="courseInfo.teacherId" filterable placeholder="请选择">
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="所需课时" prop="lessonNum">
      <el-input-number v-model="courseInfo.lessonNum" />
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input v-model="courseInfo.price" placeholder="1-2位小数或整数" />
    </el-form-item>
    <el-form-item label="上传封面">
      <ImageUpload :url="courseInfo.cover" @img-upload="imgUploaded" />
    </el-form-item>
    <el-form-item label="课程简介" prop="description">
      <Tinymce v-model="courseInfo.description" />
    </el-form-item>

  </el-form>
</template>

<script>
import ImageUpload from '@/components/common/ImageUpload'
import { getSubject } from '@/api/subject'
import { getTeacherAll } from '@/api/teacher'
import { addCourseInfo } from '@/api/course'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'CourseInfo',
  components: { ImageUpload, Tinymce },
  props: {
    courseInfoUpdate: { // 当有值进来的时候表示更新操作
      default: null,
      type: Object
    }
  },
  data() {
    return {
      loading: true,
      teacherList: [],
      subjectInfo: {
        parent: null,
        children: null
      },
      courseInfo: {
        id: null,
        title: null,
        lessonNum: null,
        subjectParentId: null,
        subjectId: null,
        teacherId: null,
        description: null,
        cover: 'https://mqd-online-edu.oss-cn-guangzhou.aliyuncs.com/2021/10/22/eaeb3bc929b34ef486447c9ab84f85ef.png',
        price: null
      },
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        lessonNum: [
          { required: true, message: '请输入课时', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: '^([0-9]{1,}([.][0-9]{1,2})?)$', message: '请输入正确的格式，1-2位小数或整数' }
        ],
        description: [
          { required: true, message: '请输入课程简介', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'courseInfo.subjectParentId': {
      handler(val) {
        if (val) {
          getSubject({ parentId: val }).then(res => {
            this.subjectInfo.children = res.data.primarySubList
            this.courseInfo.subjectId = this.subjectInfo.children[0].id
          })
        }
      },
      immediate: true
    }
  },
  created() {
    const sub = getSubject({ parentId: 0 }).then(res => {
      this.subjectInfo.parent = res.data.primarySubList
      this.courseInfo.subjectParentId = this.subjectInfo.parent[0].id
    })
    const teachers = getTeacherAll().then(res => {
      this.teacherList = res.data.teacherList
      this.courseInfo.teacherId = this.teacherList[0].id
    })
    Promise.all([sub, teachers]).then(value => {
      this.loading = false
      // 判断是否是更新，当props有值的时候就是更新状态
      if (this.courseInfoUpdate) {
        this.courseInfo = { ...this.courseInfoUpdate }
      }
    })
  },
  methods: {
    submitForm() {
      this.$refs['courseInfo'].validate((valid) => {
        if (valid) {
          this.loading = true
          // 如果id存在表示更新
          if (this.id) {
            console.log(`${this.id},要更新`)
          } else {
            addCourseInfo(this.courseInfo).then(res => {
              this.loading = false
              this.$emit('info-upload', res.data.courseInfo.id)
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '必须按照规则填写'
          })
          return false
        }
      })
    },
    imgUploaded(url) {
      this.courseInfo.cover = url
    }
  }
}
</script>

<style scoped>

</style>
