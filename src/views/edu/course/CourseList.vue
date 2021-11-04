<template>
  <div class="app-container">
    <!--  查询表单  -->
    <el-form ref="ruleForm" :model="courseQuery" :rules="queryRules" label-width="100px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="课程名称">
            <el-input v-model="courseQuery.title" placeholder="请输入课程名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="一级分类">
            <el-select v-model="courseQuery.subjectParentId" clearable>
              <el-option
                v-for="item in subject.primarySubjectList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="二级分类">
            <el-select v-model="courseQuery.subjectId" clearable>
              <el-option
                v-for="item in subject.secondSubjectList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格区间">
            <el-input v-model="courseQuery.priceMin" style="width: 48%;" placeholder="请输入最低价格" clearable />-
            <el-input v-model="courseQuery.priceMax" style="width: 48%;" placeholder="请输入最高价格" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否发布">
            <el-select v-model="courseQuery.status" clearable>
              <el-option key="Normal" label="已发布" value="Normal" />
              <el-option key="Draft" label="未发布" value="Draft" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="销售区间">
            <el-input v-model="courseQuery.minBuyCount" style="width: 48%;" placeholder="请输入最低购买量" clearable />-
            <el-input v-model="courseQuery.maxBuyCount" style="width: 48%;" placeholder="请输入最高购买量" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="浏览量区间">
            <el-input v-model="courseQuery.minViewCount" style="width: 48%;" placeholder="请输入最低浏览量" clearable />-
            <el-input v-model="courseQuery.maxViewCount" style="width: 48%;" placeholder="请输入最高浏览量" clearable />
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="getCourseByQuery">查询</el-button>
      </el-row>
    </el-form>
    <!-- 表格主体信息 -->
    <el-table
      :data="courseInfoList"
      border
      class="table-body"
    >
      <el-table-column
        fixed
        prop="title"
        label="课程名称"
        width="200"
      />
      <el-table-column
        prop="cover"
        label="封面"
        width="300"
      >
        <template slot-scope="scope">
          <img height="100px" :src="scope.row.cover" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="subjectParentName"
        label="一级分类"
        width="200"
      />
      <el-table-column
        prop="subjectName"
        label="二级分类"
        width="200"
      />
      <el-table-column
        prop="lessonNum"
        label="总课时"
        width="120"
      />
      <el-table-column
        prop="status"
        label="发布状态"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Normal'" type="success">已发布</el-tag>
          <el-tag v-else type="danger">未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyCount"
        label="销售量"
        width="200"
      />
      <el-table-column
        prop="viewCount"
        label="浏览量"
        width="200"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editCourse(1,scope.row.id)">修改基本信息</el-button>
          <el-button type="text" size="small" @click="editCourse(2,scope.row.id)">修改大纲</el-button>
          <el-button v-if="scope.row.status === 'Normal'" type="text" size="small" @click="publishCourseBtn({id: scope.row.id, pub: 0})">取消发布</el-button>
          <el-button v-else type="text" size="small" @click="publishCourseBtn({id: scope.row.id, pub: 1})">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页插件  -->
    <el-pagination
      hide-on-single-page
      background
      :current-page.sync="pageInfo.current"
      layout="total, prev, pager, next, jumper"
      :total="pageInfo.total"
      :page-size="pageInfo.size"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getCourseList, publishCourse } from '@/api/course'
import { getSubject } from '@/api/subject'

export default {
  name: 'CourseList',
  data() {
    return {
      courseInfoList: [],
      pageInfo: {
        current: null,
        pages: null,
        total: null,
        size: 10
      },
      subject: {
        primarySubjectList: null,
        secondSubjectList: null
      },
      courseQuery: {
        title: null,
        subjectParentId: null,
        subjectId: null,
        status: null,
        priceMin: null,
        priceMax: null,
        minBuyCount: null,
        maxBuyCount: null,
        minViewCount: null,
        maxViewCount: null
      },
      queryRules: {},
      isSubmitting: false // 此参数防止在请求期间重复发起请求
    }
  },
  watch: {
    'courseQuery.subjectParentId': {
      handler(val) {
        this.courseQuery.subjectId = null
        if (val !== '' && val !== null) {
          getSubject({ parentId: val }).then(res => {
            this.subject.secondSubjectList = res.data.primarySubList
          })
        }
      }
    }
  },
  created() {
    this.fetchCourseList()
    getSubject({ parentId: 0 }).then(res => {
      this.subject.primarySubjectList = res.data.primarySubList
    })
  },
  methods: {
    // 获取课程信息
    fetchCourseList(query) {
      getCourseList(query).then(res => {
        this.courseInfoList = res.data.courseList
        this.pageInfo = { ...res.data.pageInfo }
        this.isSubmitting = false
      }).finally(() => {
        this.isSubmitting = false
      })
    },
    // 改变当前页码
    handleCurrentChange(current) {
      this.pageInfo.current = current
      this.fetchCourseList(this.pageInfo)
    },
    // 根据id修改课程信息，跳转到指定信息页
    editCourse(step, id) {
      this.$router.push(`/course/info/${step}/${id}`)
    },
    // 根据条件查询
    getCourseByQuery() {
      if (this.isSubmitting) {
        return
      }
      this.isSubmitting = true
      this.fetchCourseList({ ...this.pageInfo, ...this.courseQuery })
    },
    // 发布课程
    publishCourseBtn(status) {
      publishCourse(status).then(res => {
        this.fetchCourseList({ ...this.pageInfo, ...this.courseQuery })
      })
    }
  }
}
</script>

<style scoped>
.table-body{
  margin-top: 10px;
  width: 100%;
}
</style>
