<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleDialog()">新增用户</el-button>
    </div>

    <el-table v-loading="loading.table" :data="list" border fit>
      <el-table-column prop="id" label="ID" align="center" sortable width="100" />
      <el-table-column label="头像" align="center" min-width="100">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.avatar" alt @click="handleDialog(scope.row)" >
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" min-width="100" />
      <el-table-column prop="nickName" label="昵称" align="center" min-width="100" />
      <el-table-column prop="email" label="邮箱" align="center" min-width="150" />
      <el-table-column prop="note" label="备注" align="center" min-width="150" />
      <el-table-column label="角色" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.roleIds"
            :key="item"
            style="margin-bottom: 4px;"
            type="success"
          >{{ getAdminRole(item) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" min-width="150" />
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getData()"
    />

    <el-dialog
      :title="`${type === 'create' ? '新增' : '编辑'}账号`"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" :prop="type === 'create' ? 'password' : ''">
          <el-input v-model="dataForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="重复密码" :prop="type === 'create' ? 'repassword' : ''">
          <el-input v-model="dataForm.repassword" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dataForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataForm.note" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="头像">
          <Upload
            :loading="loading.upload"
            :preview="dataForm.avatar"
            @beforeUpload="beforeUpload"
            @handleSuccess="handleSuccess"
            @handleError="handleError"
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
import Pagination from '@/components/Pagination'
import Upload from '@/components/Upload'
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { listRole } from '@/api/role'

const initDataForm = {
  username: '',
  password: '',
  repassword: '',
  nickName: '',
  email: '',
  roleIds: [],
  status: 1,
  note: '',
  avatar: ''
}

export default {
  name: 'Admin',
  components: { Pagination, Upload },
  data() {
    return {
      loading: {
        table: false,
        dataForm: false,
        upload: false
      },
      visible: {
        dataForm: false
      },
      roleList: [],
      list: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 20
      },
      type: 'create',
      dataForm: { ...initDataForm },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'change' },
          {
            validator: (rule, value, cb) =>
              this.dataForm.password === this.dataForm.repassword ? cb() : cb('两次输入的密码不一致')
          }
        ],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
        roleIds: [{ required: true, message: '请输入角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
    this.getRoleList()
  },
  methods: {
    async getData() {
      this.loading.table = true
      try {
        const res = await listAdmin({ ...this.query })
        this.list = res.data
        this.total = res.attributes ? res.attributes.total : res.data.length
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    async getRoleList() {
      this.loading.table = true
      try {
        const res = await listRole()
        this.roleList = res.data
      } catch (error) {
        console.log(error)
      }
      this.loading.table = false
    },
    handleDialog(row) {
      if (row) {
        this.dataForm = { ...row }
        this.dataForm.status = row.status === 1
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
        if (!valid) return this.$message.error('请完善角色信息')
        this.loading.dataForm = true
        try {
          const req = { ...this.dataForm }
          req.status = req.status ? 1 : 0
          let res
          if (this.type === 'create') {
            res = await createAdmin(req)
          } else {
            res = await updateAdmin(req)
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
      this.$confirm(`确定${row.status === 1 ? '禁用' : '启用'}该账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const req = { ...row }
            const res = await updateAdmin(req)
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
      this.$confirm(`确定删除该账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.loading.table = true
          try {
            const res = await deleteAdmin(row.id)
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
    beforeUpload() {
      this.loading.upload = true
    },
    handleSuccess(res, file, fileList) {
      if (res.status !== 200) {
        return this.$message.error('图片上传失败')
      }
      this.dataForm.avatar = res.data

      const img = new Image()
      img.onload = () => {
        this.loading.upload = false
      }
      img.src = res.data
    },
    handleError(err) {
      this.$message.error('图片上传失败:' + err.message)
      this.loading.upload = false
    },
    getAdminRole(role) {
      if (!role) return '-'
      const adminRole = this.roleList.find(o => o.id === role)
      return adminRole ? adminRole.name : '-'
    }
  }
}
</script>

<style lang="scss" scope>
.filter-container {
  margin-bottom: 10px;
}
</style>
