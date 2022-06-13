<template>
  <el-container class="layout-container-demo">
  <Aside></Aside>
   <el-container class="container">
     <Header></Header>
     <router-view></router-view>
   </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './aside.vue'
import Header from './header.vue'
</script>

<script lang="ts">
export default {
  name: 'MyHome'
}
</script>

<style>
.container{
  flex-direction: column;
}
.layout-container-demo{
  position:absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 1200px;
}
</style>
