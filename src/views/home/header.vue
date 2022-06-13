<template>
  <el-header style="text-align: right; font-size: 12px;">
    <div class="breadcrumb">
      <el-page-header icon="Fold" title="首页" style="float: left" />
      <el-breadcrumb separator="/" style="float: right" v-show="route.path!=='/home'">
       <el-breadcrumb-item :to="{ path: '' }">{{bread}}</el-breadcrumb-item>
       <el-breadcrumb-item>{{breaditem}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="toolbar" style="float: right">
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px"
          ><setting
        /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>首页</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>admin</span>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { logoutUser } from '@/API/user.js'
import { removeCookie } from '@/utils/cookie/index.js'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from '@vue/runtime-core'
const router = useRouter()
const route = useRoute()
const bread = ref('')
const breaditem = ref('')
async function logout () {
  try {
    await logoutUser()
    removeCookie('token')
    router.replace('/login')
  } catch (error) {
    alert(error)
  }
}
watch(() => route.path, (newval, oldval) => {
  if (newval.includes('/product')) {
    bread.value = '商品管理'
    breaditem.value = route.meta.title as string
  }
}, { immediate: true })
</script>

<script lang="ts" scoped>
export default {
  name: 'MyHeader'
}
</script>

<style scoped lang="less">
.el-header {
  position: relative;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
  color: var(--el-text-color-primary);
  .el-page-header,
  .el-breadcrumb {
    height: 60px;
    line-height: 60px;
  }
}
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.breadcrumb {
  float: left;
}
</style>
