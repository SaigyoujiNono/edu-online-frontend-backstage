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
import { addCourseInfo, updateCourseInfo } from '@/api/course'
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
        cover: 'https://img0.baidu.com/it/u=211849578,1713280059&fm=26&fmt=auto',
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
          { pattern: '^([0-9]{1,}([.][0-9]{1,2})?)$', message: '请输入正确的格式，1-2位小数或整数', trigger: 'change' }
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
            if (this.subjectInfo.children[0]) {
              this.courseInfo.subjectId = this.subjectInfo.children[0].id
            } else {
              this.courseInfo.subjectId = null
            }
          })
        }
      },
      immediate: true
    },
    courseInfoUpdate() {
      this.courseInfo = { ...this.courseInfoUpdate }
      this.courseInfo.price = this.courseInfoUpdate.price + ''
    }
  },
  created() {
    const sub = getSubject({ parentId: 0 }).then(res => {
      this.subjectInfo.parent = res.data.primarySubList
    })
    const teachers = getTeacherAll().then(res => {
      this.teacherList = res.data.teacherList
    })
    Promise.all([sub, teachers]).then(value => {
      this.courseInfo.subjectParentId = this.subjectInfo.parent[0].id
      this.courseInfo.teacherId = this.teacherList[0].id
      this.loading = false
    })
  },
  methods: {
    submitForm() {
      this.$refs['courseInfo'].validate((valid) => {
        if (valid) {
          this.loading = true
          // 如果id存在表示更新
          if (this.courseInfo.id) {
            updateCourseInfo(this.courseInfo).then(res => {
              this.loading = false
              this.$emit('info-upload', res.data.courseInfo.id)
            }).catch(() => {
              this.loading = false
            })
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
