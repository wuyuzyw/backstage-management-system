<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登入页面</h2>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <span>
            <el-icon><avatar /></el-icon>
          </span>
          <el-input v-model.trim="ruleForm.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <span>
            <el-icon><lock /></el-icon>
          </span>
          <el-input
            type="password"
            show-password
            v-model.trim="ruleForm.password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item style="padding-left: 0">
          <el-button type="primary" :loading="loading" @click="login(ruleFormRef)">登入</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 导入操作cookie的方法
import { setCookie } from '../utils/cookie/index.js'
import { useRouter } from 'vue-router'

// 导入用户请求
import { loginUser } from '../API/user.js'

import { ElMessage } from 'element-plus'
const router = useRouter()
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  // 用户名，密码
  username: 'admin',
  password: '111111'
})
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, message: '长度不能小于5', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '长度不能小于6', trigger: 'blur' }
  ]
})

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    // 校验成功
    if (valid) {
      loading.value = true
      try {
        const result = await loginUser(ruleForm)
        setCookie('token', result.data.token)
        router.push('/home')
        loading.value = false
      } catch (error) {
        const message = error || '用户名不存在'
        ElMessage.error(message)
        loading.value = false
      }
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'MyLogin'
}
</script>

<style lang="less" scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: @bgColor;
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35%;
    min-width: 360px;
    h2 {
      color: #fff;
      text-align: center;
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
      margin: 5px 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #263041;
      span {
        margin-left: 15px;
        color: #889aa4;
        font-size: 18px;
      }
      .el-input__wrapper {
        height: 50px;
        background-color: #263041;
        border-radius: 5px;
        box-shadow: none;
        .el-input__inner {
          color: #fff;
          font-size: 16px;
        }
      }
      button {
        width: 100%;
        height: 40px;
        span{
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
}
:deep(.el-form-item__error) {
  padding: 8px 0;
}
</style>
