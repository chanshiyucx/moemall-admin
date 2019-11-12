<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleDialog()">新增属性分类</el-button>
    </div>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column prop="name" label="名称" align="center" min-width="100">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleDialog(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="attributeCount" label="属性数量" align="center" min-width="100" />
      <el-table-column prop="paramCount" label="参数数量" align="center" min-width="100" />
      <el-table-column label="操作" align="center" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleAttrList(scope.row, 'attribute')">属性列表</el-button>
          <el-button type="primary" size="mini" @click="handleAttrList(scope.row, 'type')">参数列表</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getData()"
    />

    <el-dialog
      :title="`${type === 'create' ? '新增' : '编辑'}属性分类`"
      :visible.sync="visible.dataForm"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入属性分类名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible.dataForm = false">取消</el-button>
        <el-button type="primary" :loading="loading.dataForm" @click="handleSure">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAttributeCategory,
  createAttributeCategory,
  updateAttributeCategory,
  deleteAttributeCategory
} from '@/api/productAttr'
import Pagination from '@/components/Pagination'

const initDataForm = {
  name: ''
}

export default {
  name: 'ProductAttr',
  components: { Pagination },
  data() {
    return {
      loading: {
        table: false,
        dataForm: false
      },
      visible: {
        dataForm: false
      },
      list: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 20
      },
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading.table = true
      try {
        const res = await listAttributeCategory({ ...this.query })
        this.list = res.data
        this.total = res.attributes ? res.attributes.total : res.data.length
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    handleDialog(row) {
      if (row) {
        this.dataForm = { ...row }
        this.type = 'edit'
      } else {
        this.dataForm = { ...initDataForm }
        this.type = 'create'
      }
      this.loading.dataForm = false
      this.visible.dataForm = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSure() {
      this.$refs['dataForm'].validate(async valid => {
        if (!valid) return this.$message.error('请完善属性分类信息')
        this.loading.dataForm = true
        try {
          const data = new URLSearchParams()
          data.append('name', this.dataForm.name)
          let res
          if (this.type === 'create') {
            res = await createAttributeCategory(data)
          } else {
            res = await updateAttributeCategory(this.dataForm.id, data)
          }
          this.$message.success(res.message || 'OK')
          this.visible.dataForm = false
          this.getData()
        } catch (error) {
          console.log(error)
        }
        this.loading.dataForm = false
      })
    },
    handleDelete(row) {
      this.$confirm(`确定删除该属性分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deleteAttributeCategory(row.id)
            this.$message.success(res.message || 'OK')
            this.getData()
          } catch (error) {
            console.log(error)
          }
          this.loading.table = false
        })
        .catch(() => {
          console.log('关闭弹窗')
        })
    },
    handleAttrList(row, type) {}
  }
}
</script>

<style lang="scss" scope>
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
