<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleDialog()">新增角色</el-button>
    </div>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column prop="name" label="名称" align="center" sortable min-width="100">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleDialog(scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center" sortable min-width="150" />
      <el-table-column prop="adminCount" label="用户数量" align="center" sortable min-width="100" />
      <el-table-column label="状态" align="center" sortable min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" sortable min-width="150" />
      <el-table-column label="操作" align="center" min-width="200px">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status === 1 ? 'warning' : 'success'"
            size="mini"
            @click="handleStatus(scope.row)"
          >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${type === 'create' ? '新增' : '编辑'}角色`"
      :visible.sync="visible.dataForm"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:20px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="dataForm.status" active-text="启用" inactive-text="禁用" />
        </el-form-item>
        <el-form-item v-if="visible.dataForm" label="权限">
          <el-tree
            ref="tree"
            :data="permissionList"
            :default-checked-keys="checked"
            :check-strictly="true"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            @check="handleCheckChange"
          />
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
import { listRole, createRole, updateRole, deleteRole } from '@/api/role'
import { listPermission } from '@/api/permission'

const initDataForm = {
  name: '',
  description: '',
  status: true,
  permissionIds: []
}

export default {
  name: 'Role',
  data() {
    return {
      loading: {
        table: false,
        dataForm: false
      },
      visible: {
        dataForm: false
      },
      permissionList: [],
      list: [],
      total: 0,
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'change' }],
        status: [{ required: true, message: '请选择角色状态', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checked: []
    }
  },
  created() {
    this.getData()
    this.getPermissionList()
  },
  methods: {
    async getData() {
      this.loading.table = true
      try {
        const res = await listRole()
        this.list = res.data
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    async getPermissionList() {
      this.loading.table = true
      try {
        const res = await listPermission()
        this.permissionList = res.data
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    handleDialog(row) {
      if (row) {
        this.dataForm = { ...row }
        this.dataForm.status = row.status === 1
        this.checked = [...row.permissionIds]
        this.type = 'edit'
      } else {
        this.dataForm = { ...initDataForm }
        this.checked = []
        this.type = 'create'
      }
      this.loading.dataForm = false
      this.visible.dataForm = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCheckChange() {
      const checkedIds = this.$refs.tree.getCheckedKeys()
      this.dataForm.permissionIds = checkedIds
    },
    handleSure() {
      this.$refs['dataForm'].validate(async valid => {
        if (!valid) return this.$message.error('请完善角色信息')
        this.loading.dataForm = true
        try {
          const req = { ...this.dataForm }
          req.status = req.status ? 1 : 0
          let res
          if (this.type === 'create') {
            res = await createRole(req)
          } else {
            res = await updateRole(req)
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
    handleStatus(row) {
      this.$confirm(`确定${row.status === 1 ? '禁用' : '启用'}该角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const req = { ...row }
            req.status = row.status === 1 ? 0 : 1
            const res = await updateRole(req)
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
    handleDelete(row) {
      this.$confirm(`确定删除该角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deleteRole(row.id)
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
    }
  }
}
</script>

<style lang="scss" scope>
.filter-container {
  margin-bottom: 10px;
}
</style>
