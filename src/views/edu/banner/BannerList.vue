<template>
  <div class="app-container">
    <!-- banner列表-->
    <el-table
      v-loading="loading"
      :data="bannerList"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        property="title"
        label="标题"
        width="200"
      />
      <el-table-column
        property="imageUrl"
        label="图片"
        width="450"
      >
        <template slot-scope="scope">
          <img width="400px" height="200px" :src="scope.row.imageUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column
        property="linkUrl"
        label="地址"
        width="300"
      >
        <template slot-scope="scope">
          {{ scope.row.linkUrl === '' ? '无' : scope.row.linkUrl }}
        </template>
      </el-table-column>
      <el-table-column
        property="sort"
        label="排序"
        width="100"
      />
      <el-table-column
        property="gmtCreate"
        label="创建时间"
        width="300"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click.native.prevent="updateRow(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click.native.prevent="deleteRow(scope.row.id)"
          >
            删除
          </el-button>
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
  </div>
</template>

<script>
import { delBanner, getBanner } from '@/api/banner'

export default {
  name: 'BannerList',
  data() {
    return {
      loading: false,
      bannerList: [],
      pageInfo: {
        current: 0,
        total: 10,
        size: 10
      }
    }
  },
  created() {
    this.fetchData({ sort: false })
  },
  methods: {
    // 获取数据
    fetchData(options) {
      this.loading = true
      getBanner(options).then(res => {
        this.bannerList = res.data.bannerList
      }).finally(() => {
        this.loading = false
      })
    },
    // 翻页
    handleCurrentChange(current) {
      this.fetchData({ current })
    },
    // 删除弹出框
    deleteRow(id) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delBanner(id)
      }).then(() => {
        if (this.bannerList.length === 1) {
          this.fetchData({ current: this.pageInfo.current <= 1 ? 1 : this.pageInfo.current - 1 })
        } else {
          this.fetchData({ current: this.pageInfo.current })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
