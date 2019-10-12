<template>
  <div class="app-container">
    <el-table v-loading="loading.table" :data="list" row-key="id" :tree-props="{children: 'children'}" :row-class-name="tableRowClassName" border fit>
      <el-table-column prop="id" label="ID" align="left" sortable width="120" />
      <el-table-column prop="name" label="名称" align="center" sortable min-width="100">
        <template slot-scope="scope">
          <el-link :type="tableRowType(scope.row)" @click="handleDialog(scope.row, 'update')">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="权限值" align="center" sortable min-width="150" />
      <el-table-column label="状态" align="center" sortable min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" sortable min-width="150" />
      <el-table-column label="操作" align="center" min-width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDialog(scope.row, 'create')">新增</el-button>
          <el-button v-if="scope.row.value" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="`${type === 'create' ? '新增' : '编辑'}权限`" :visible.sync="visible.dataForm" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="80px" style="width: 400px; margin-left:20px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="权限值">
          <el-input v-model="dataForm.value" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="dataForm.status" active-text="启用" inactive-text="禁用" />
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
import { listPermission, createPermission, updatePermission, deletePermission } from '@/api/permission'

const initDataForm = {
  pid: '',
  name: '',
  value: '',
  status: true
}

export default {
  name: 'Permission',
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
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        value: [{ required: true, message: '请输入权限值', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
        const res = await listPermission()
        this.list = res.data
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    handleDialog(row, type) {
      this.type = type
      if (type === 'create') {
        this.dataForm = { ...initDataForm, pid: row.id }
      } else {
        this.dataForm = { ...row }
        this.dataForm.status = row.status === 1
      }
      this.loading.dataForm = false
      this.visible.dataForm = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSure() {
      this.$refs['dataForm'].validate(async valid => {
        if (!valid) return this.$message.error('请完善权限信息')
        this.loading.dataForm = true
        try {
          const req = { ...this.dataForm }
          req.status = req.status ? 1 : 0
          let res
          if (this.type === 'create') {
            res = await createPermission(req)
          } else {
            res = await updatePermission(req)
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
      if (row.children.length) {
        return this.$message.error('该权限有子权限，无法删除！')
      }
      this.$confirm(`确定删除该权限?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deletePermission(row.id)
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
    tableRowType(row) {
      if (row.pid === 0) {
        return 'primary'
      } else if (row.children.length) {
        return 'success'
      }
      return 'warning'
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.pid === 0) {
        return ''
      } else if (row.children.length) {
        return 'first-row'
      }
      return 'second-row'
    }
  }
}
</script>

<style lang="scss" scope>
.el-table {
  .first-row {
    background: #f0f9eb;
  }
  .second-row {
    background: #fdf5e6;
  }
}
</style>
