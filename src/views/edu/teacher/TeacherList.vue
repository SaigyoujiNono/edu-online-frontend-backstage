<template>
  <div class="app-container">
    <!-- 以下是条件查询-->
    <el-form ref="form" :model="teacherQuery" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="讲师姓名">
            <el-input v-model="teacherQuery.name" type="text" placeholder="请输入姓名" maxlength="10" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="讲师等级">
            <el-select v-model="teacherQuery.level" placeholder="请选择">
              <el-option label="无" :value="null" />
              <el-option label="高级讲师" value="1" />
              <el-option label="首席讲师" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间">
            <el-date-picker v-model="teacherQuery.start" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
            ---
            <el-date-picker v-model="teacherQuery.end" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="queryTeacher">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 以下是教师列表-->
    <el-table v-loading="listLoading" :data="teachers" style="width: 100%">
      <el-table-column fixed prop="name" label="姓名" width="80" />
      <el-table-column prop="intro" label="简介" show-overflow-tooltip width="500" />
      <el-table-column prop="career" label="讲师资历" width="200" />
      <el-table-column prop="level" label="讲师头衔" width="160">
        <template slot-scope="scope">
          {{ scope.row.level===1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="讲师头像" width="100">
        <template slot-scope="scope">
          <img height="40px" :src="scope.row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="120" />
      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.native.prevent="updateRow(scope.row)">
            修改
          </el-button>&nbsp;&nbsp;&nbsp;
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            confirm-button-type="danger"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @onConfirm="deleteRow(scope.row.id)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      hide-on-single-page
      background
      :current-page.sync="pageInfo.current"
      layout="total, prev, pager, next, jumper"
      :total="pageInfo.total"
      :page-size="pageInfo.size"
      @current-change="handleCurrentChange"
    />
    <!--修改-->
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible"
      width="1400px"
      lock-scroll
      :modal-append-to-body="false"
    >
      <TeacherTemplate ref="teacherTemplate" :teacher-prop="teacherUpdate" @update-successful="rowUpdated" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacher, deleteTeacher } from '@/api/teacher'
import TeacherTemplate from '@/components/edu/teacher/TeacherTemplate'

export default {
  components: { TeacherTemplate },
  data() {
    return {
      listLoading: true,
      teachers: null,
      pageInfo: {
        current: null,
        pages: null,
        total: null,
        size: 10
      },
      dialogFormVisible: false,
      teacherUpdate: {
        id: null,
        name: null,
        intro: null,
        career: null,
        level: null,
        avatar: null,
        sort: null
      },
      teacherQuery: {
        name: null,
        level: null,
        start: null,
        end: null
      }
    }
  },
  created() {
    this.fetchData({ current: 1 })
  },
  methods: {
    // 请求数据
    fetchData(option) {
      this.listLoading = true
      getTeacher(option.current, option.size, option.teacherQuery).then(response => {
        this.teachers = response.data.teacherInfo.teachers
        this.pageInfo.current = response.data.teacherInfo.current
        this.pageInfo.pages = response.data.teacherInfo.pages
        this.pageInfo.total = response.data.teacherInfo.total
        this.listLoading = false
      })
    },
    handleCurrentChange(current) {
      this.fetchData({ current: current, teacherQuery: this.teacherQuery })
    },
    // 修改
    updateRow(t) {
      this.dialogFormVisible = true
      const { id, name, intro, career, level, avatar, sort } = t
      this.dialogFormVisible = true
      this.teacherUpdate = { id, level, name, intro, career, avatar, sort }
    },
    // 修改页面点击确定时触发
    dialogUpdate() {
      this.$refs.teacherTemplate.onUpdate('teacher')
      this.dialogFormVisible = false
    },
    rowUpdated() {
      this.fetchData({ current: this.pageInfo.current, teacherQuery: this.teacherQuery })
    },
    queryTeacher() {
      this.fetchData({ current: 1, teacherQuery: this.teacherQuery })
    },
    // 删除数据
    deleteRow(id) {
      if (this.teachers.length === 1) {
        deleteTeacher(id).then(() => {
          this.fetchData({ current: this.pageInfo.current - 1, teacherQuery: this.teacherQuery })
        })
      } else {
        deleteTeacher(id).then(() => {
          this.fetchData({ current: this.pageInfo.current, teacherQuery: this.teacherQuery })
        })
      }
    }
  }

}
</script>
