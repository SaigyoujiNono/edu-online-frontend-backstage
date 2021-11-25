<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      v-loading="loading"
      :data="subject"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      :render-content="renderContent"
    />

  </div>
</template>

<script>
import { delSubject, getSubjectTree } from '@/api/subject'

export default {

  data() {
    return {
      loading: true,
      filterText: '',
      subject: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    getSubjectTree().then((res) => {
      this.subject = res.data.tree
      this.loading = false
    })
  },
  mounted() {
    document.querySelectorAll('.custom-tree-node')
  },
  methods: {
    removeNode(node, data) {
      delSubject(data.id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.remove(node, data)
      })
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button size='mini' type='text' on-click={ () => this.removeNode(node, data) }>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style>
.custom-tree-node {
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

