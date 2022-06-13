<template>
  <div class="trade-container">
    <el-button
      type="primary"
      icon="Plus"
      size="large"
      text
      @click="dialogFormVisible = true"
      >添加</el-button
    >
    <el-table
      ref="singleTableRef"
      :data="data"
      highlight-current-row
      style="width: 100%"
      border
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" align="center">
        <template #default="scoped">
          {{ scoped.row.tmName }}
        </template>
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template #default="scoped">
          <img :src="scoped.row.logoUrl" style="width: 100px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="scoped">
          <el-button size="large" type="warning" icon="EditPen" @click="handleEdit(scoped.row)">修改</el-button>
          <el-button size="large" type="danger" icon="Delete" @click="handleDelete(scoped.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
    v-model:currentPage="result.current"
    v-model:page-size="result.size"
    :page-sizes="[3, 5, 10]"
    :background="true"
    layout="prev, pager, next, jumper, ->,sizes,total"
    :total="result.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <el-dialog v-model="dialogFormVisible" :title="title" :before-close="handleClose">
    <el-form :model="form" ref="ruleFormRef" :rules="rules" class="demo-ruleForm">
      <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
        <el-input v-model="form.tmName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="imgUrl">
        <el-upload
          class="avatar-uploader"
          action="/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
           <template #tip>
      <div class="el-upload__tip">
        只能上传jpg的文件,且不能超过2MB
      </div>
    </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="canCle">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)
"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getTradeInfo, addOrUpdateTrademark, removeTrademark } from '@/API/product/trademark.js'
import { reactive, ref } from '@vue/reactivity'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const data = ref([])
const result: { [prop: string]: number } = reactive({})
const title = ref('添加品牌')
const getTrademark = async function (page: number, limit: number) {
  try {
    const { data: res } = await getTradeInfo(page, limit)
    result.current = res.current
    result.size = res.size
    result.total = res.total
    data.value = res.records
  } catch (error) {
    ElMessage.error('商品列表获取失败，请刷新！')
  }
}
getTrademark(1, 3)
const handleSizeChange = (val: number) => {
  getTrademark(1, val)
}
const handleCurrentChange = (val: number) => {
  getTrademark(val, result.size)
}
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form:{tmName:string, imgUrl:string, [prop:string]:string|number} = reactive({
  tmName: '',
  imgUrl: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  tmName: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 1, max: 6, message: '长度必须在1~6个字符之间', trigger: 'blur' }
  ],
  imgUrl: [
    { required: true, message: '请上传你的图片', trigger: 'change' }
  ]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await addOrUpdateTrademark(form)
        if (form.id) {
          ElMessage.success('修改成功')
        } else {
          ElMessage.success('添加成功')
        }
        form.tmName = ''
        form.imgUrl = ''
        dialogFormVisible.value = false
        getTrademark(result.current, result.size)
      } catch (error) {
        if (form.id) {
          ElMessage.error('修改失败')
        } else {
          ElMessage.error('添加失败')
        }
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const canCle = function () {
  dialogFormVisible.value = false
  form.tmName = ''
  form.imgUrl = ''
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  form.imgUrl = URL.createObjectURL(uploadFile.raw)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否关闭对话框?', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => {
    done()
    form.tmName = ''
    form.imgUrl = ''
  }).catch(() => {
    done()
  })
}
const handleEdit = function (trademark:{tmName:string, logoUrl:string, id:number}) {
  title.value = '修改品牌'
  form.tmName = trademark.tmName
  form.imgUrl = trademark.logoUrl
  form.id = trademark.id
  dialogFormVisible.value = true
}
const handleDelete = (trademark:{id :number}) => {
  ElMessageBox.confirm(
    '你是否要删除此商品?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await removeTrademark(trademark.id)
        ElMessage({ type: 'success', message: '删除成功' })
        if (data.value.length === 1) {
          result.current--
        }
        getTrademark(result.current, result.size)
      } catch (error) {
        let message = '删除失败'
        if (error === '失败') {
          message = '系统文件，不能删除'
        }
        ElMessage.error(message)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除操作已取消'
      })
    })
}
</script>
<script lang="ts">
export default {
  name: 'tradeMark'
}
</script>

<style lang="less" scoped>
.trade-container {
  margin: 10px;
  button {
    margin-bottom: 10px;
  }
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
