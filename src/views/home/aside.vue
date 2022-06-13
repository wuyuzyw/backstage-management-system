<template>
  <el-aside width="200px">
    <el-scrollbar>
      <el-menu :default-active="active" text-color="#ccc">
        <el-menu-item index="1" @click="toHome">
            <el-icon><house /></el-icon>
            <template #title>首页</template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><lock /></el-icon>权限管理
          </template>
          <el-menu-item-group>
            <template #title>Group 1</template>
            <el-menu-item index="2-1">Option 1</el-menu-item>
            <el-menu-item index="2-2">Option 2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group 2">
            <el-menu-item index="2-3">Option 3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="2-4">
            <template #title>Option 4</template>
            <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><goods /></el-icon>商品管理
          </template>
          <el-menu-item index="3-1" @click="dropRoute(1)">
            品牌管理
          </el-menu-item>
          <el-menu-item index="3-2" @click="dropRoute(2)">平台属性管理</el-menu-item>
          <el-menu-item index="3-3" @click="dropRoute(3)">Spu管理</el-menu-item>
          <el-menu-item index="3-4">Sku管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
import { watch } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
let active = '1'
watch(() => route.path, () => {
  active = route.meta.index as string
}, { immediate: true })
const dropRoute = function (id:number) {
  switch (id) {
    case 1: router.push('/home/product/trademark'); break
    case 2: router.push('/home/product/plateform'); break
    case 3: router.push('/home/product/spu'); break
  }
}
const toHome = function () {
  router.push('/home')
}
</script>

<script lang="ts">
export default {
  name: 'MySide'
}
</script>

<style lang="less" scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: @bgColor;
}
.el-menu {
  border-right: none;
  background: @bgColor;
  .el-menu-item:hover {
    background-color: #263041;
  }
  :deep(.el-sub-menu__title:hover) {
    background-color: #263041;
  }
  li.el-menu-item,
  :deep(div.el-sub-menu__title) {
    background: @bgColor;
  }
}
</style>
