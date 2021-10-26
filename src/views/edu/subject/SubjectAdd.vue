<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>添加一级分类</span>
      </div>
      <el-form :model="primarySub" label-width="80px">
        <el-col :span="12">
          <el-form-item label="一级分类">
            <el-input v-model="primarySub.title" type="text" placeholder="请输入一级分类" maxlength="10" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="排序">
            <el-input-number v-model="primarySub.sort" :min="0" :max="10" placeholder="" />
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="6">
        <el-button style="margin-left: 50px" type="primary" icon="el-icon-document-add" @click.native.prevent="addSubject">
          添加
        </el-button>&nbsp;&nbsp;&nbsp;
      </el-col>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>添加二级分类</span>
      </div>
      <el-form :model="secondSub" label-width="80px">
        <el-col :span="7">
          <el-form-item label="一级分类">
            <el-select v-model="secondSub.parentId" filterable placeholder="请选择">
              <el-option
                v-for="item in primarySubList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="二级分类">
            <el-input v-model="secondSub.title" type="text" placeholder="请输入一级分类" maxlength="10" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="排序">
            <el-input-number v-model="secondSub.sort" :min="0" :max="10" placeholder="" />
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="4">
        <el-button style="margin-left: 50px" type="primary" icon="el-icon-document-add" @click.native.prevent="addSubjectSecond">
          添加
        </el-button>&nbsp;&nbsp;&nbsp;
      </el-col>
    </el-card>
  </div>
</template>

<script>
import { addSubject, getSubject } from '@/api/subject'

export default {
  name: 'SubjectAdd',
  data() {
    return {
      primarySub: {
        title: null,
        sort: 0,
        parentId: 0
      },
      primarySubList: null,
      secondSub: {
        title: null,
        sort: 0,
        parentId: null
      }
    }
  },
  created() {
    getSubject({ parentId: 0 }).then((res) => {
      this.primarySubList = res.data.primarySubList
      if (this.primarySubList.length !== 0) {
        this.secondSub.parentId = this.primarySubList[0].id
      }
    })
  },
  methods: {
    addSubject() {
      if (this.primarySub.title !== '' && this.primarySub.title) {
        addSubject(this.primarySub).then(() => {
          this.$router.push('/subject/tree')
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数'
        })
      }
    },
    addSubjectSecond() {
      if (this.secondSub.title !== '' && this.secondSub.title && this.secondSub.parentId) {
        addSubject(this.secondSub).then(() => {
          this.$router.push('/subject/tree')
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数'
        })
      }
    }
  }
}
</script>

<style scoped>
.box-card{
  margin: 20px 20px;
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 10%);
}

.box-card:hover{
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 30%);
}
</style>
