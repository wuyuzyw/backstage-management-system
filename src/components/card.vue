<template>
 <el-card class="box-card">
      <el-form inline :disabled="props.isDisabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category1"
            class="m-2"
            placeholder="Select"
            size="large"
            @change="text1Change"
          >
            <el-option
              v-for="item in list1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category2"
            class="m-2"
            placeholder="Select"
            size="large"
            @change="text2Change"
          >
            <el-option
              v-for="item in list2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category3"
            class="m-2"
            placeholder="Select"
            size="large"
            @change="text3Change"
          >
            <el-option
              v-for="item in list3"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import {
  getCategory1List,
  getCategory2List,
  getCategory3List,
  attrInfoList
} from '@/API/product/plateform.js'
import { defineProps, defineEmits, watchEffect } from '@vue/runtime-core'
import { ref } from '@vue/reactivity'
import { ElMessage } from 'element-plus'
const props = defineProps(['isDisabled'])
const list1 = ref([])
const category1 = ref(null)
const list2 = ref([])
const category2 = ref(null)
const list3 = ref([])
const category3 = ref(null)
const attrList = ref([])
const hide = ref(true)
const Emits = defineEmits(['getHide', 'getCategory1', 'getCategory2', 'getCategory3', 'getAttrList'])
watchEffect(() => {
  Emits('getHide', hide.value)
  Emits('getAttrList', attrList.value)
  Emits('getCategory1', category1.value)
  Emits('getCategory2', category2.value)
  Emits('getCategory3', category3.value)
})
async function getCategory2 (category1Id: number) {
  try {
    const result = await getCategory2List(category1Id)
    list2.value = result.data
  } catch (error) {
    ElMessage.error('数据获取失败，请重试')
  }
}
async function getCategory1 () {
  try {
    const result = await getCategory1List()
    list1.value = result.data
  } catch (error) {
    ElMessage.error('数据获取失败，请刷新')
  }
}
getCategory1()
function text1Change (category1Id: number) {
  category2.value = category3.value = ''
  attrList.value = []
  hide.value = true
  list3.value = []
  category1.value = category1Id
  getCategory2(category1Id)
}
async function getCategory3 (category2Id: number) {
  try {
    const result = await getCategory3List(category2Id)
    list3.value = result.data
  } catch (error) {
    ElMessage.error('数据获取失败，请重试')
  }
}
function text2Change (category2Id: number) {
  category3.value = ''
  attrList.value = []
  hide.value = true
  category2.value = category2Id
  getCategory3(category2Id)
}
async function getAttrInfoList (category3Id: number) {
  try {
    const result = await attrInfoList(
      category1.value,
      category2.value,
      category3Id
    )
    attrList.value = result.data
    hide.value = false
  } catch (error) {
    ElMessage.error('数据获取失败，请重试')
  }
}
function text3Change (category3Id: number) {
  category3.value = category3Id
  getAttrInfoList(category3Id)
}
</script>
<script lang="ts">
export default {
  name: 'MyCart'
}
</script>

<style scoped>

</style>
