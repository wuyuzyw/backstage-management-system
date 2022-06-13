<template>
  <MyCart
    style="margin: 10px 10px"
    :isDisabled="disabled"
    @getCategory3="getCategory3Id"
  />
  <el-card style="margin: 0 10px">
     <!-- 显示spu列表 -->
    <div v-show="scene === 0">
      <el-button
        type="primary"
        icon="Plus"
        size="large"
        :disabled="!category3Id"
        style="margin-bottom: 10px"
        @click="addSpu"
        >添加SPU</el-button
      >
      <el-table border highlight-current-row :data="infoList">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="spu名称" align="center">
          <template #default="{ row }">
            {{ row.spuName }}
          </template>
        </el-table-column>
        <el-table-column label="spu描述" align="center">
          <template #default="{ row }">
            {{ row.description }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="添加sku"
              placement="top-start"
            >
              <el-button icon="Plus" type="success"></el-button>
            </el-tooltip>
              <el-tooltip
              class="box-item"
              effect="dark"
              content="修改spu"
              placement="top-start"
            >
              <el-button icon="EditPen" type="warning" @click="updateSpu(row.id)"></el-button>
            </el-tooltip>
              <el-tooltip
              class="box-item"
              effect="dark"
              content="当前spu全部sku列表"
              placement="top-start"
            >
              <el-button icon="InfoFilled" type="info"></el-button>
            </el-tooltip>
              <el-tooltip
              class="box-item"
              effect="dark"
              content="删除spu"
              placement="top-start"
            >
              <el-button icon="Delete" type="danger"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 10]"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加或修改spu -->
    <SpuForm v-show="scene===1" @changeScene="changeScene" :spuList="spuList" :SpuImageList="SpuImageList" :category3Id="category3Id"></SpuForm>
    <!-- 添加sku -->
    <SkuForm v-show="scene===2"></SkuForm>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getSpuInfo, reqSpu, reqSpuImageList } from '@/API/product/spu.js'
import SpuForm from './spuform/index.vue'
import SkuForm from './skuform/index.vue'
import { ElMessage } from 'element-plus'
const disabled = ref(false) // MyCart组件是否被禁用（true:禁用）
const currentPage = ref(1) // 当前页码
const pageSize = ref(3) // 一页展示多少条数据
const total = ref(0) // 数据总共多少条
const category3Id = ref() // 三级分类的ID
const infoList = ref([]) // spu列表数据
const spuList = ref({}) // 当前spu的信息
const SpuImageList = ref([]) // 当前spu图标列表
const scene = ref(0) // 根据scene判断el-cart显示哪块内容
// 得到三级分类Id
function getCategory3Id (val: number) {
  category3Id.value = val
}
// 获取spu列表数据
async function GETSPUINFO (category3Id: number, pageSize = 3, currentPage = 1) {
  try {
    const { data: result } = await getSpuInfo(
      currentPage,
      pageSize,
      category3Id
    )
    infoList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error(error)
  }
}
// 三级分类ID有或发生变化，获取spu列表的数据
watch(category3Id, (newVal) => {
  if (newVal) {
    GETSPUINFO(newVal, pageSize.value)
  }
})
// 监听scene的值，用来改变disabled的值
watch(scene, (newVal:number) => {
  if (newVal === 0) {
    disabled.value = false
  } else {
    disabled.value = true
  }
}, { immediate: true })
// 每页条数发生改变，重新获取spu列表数据
function handleSizeChange (val:number) {
  GETSPUINFO(category3Id.value, val)
  currentPage.value = 1
  pageSize.value = val
}
// 当前页码发生改变，重新获取spu列表数据
function handleCurrentChange (val:number) {
  GETSPUINFO(category3Id.value, pageSize.value, val)
  currentPage.value = val
}
// 添加spu
function addSpu () {
  scene.value = 1
}
// 修改（更新）当前spu
async function updateSpu (spuId:number) {
  scene.value = 1
  try {
    const { data: SPULIST } = await reqSpu(spuId)
    const { data: SPUIMAGELIST } = await reqSpuImageList(spuId)
    spuList.value = SPULIST
    SpuImageList.value = SPUIMAGELIST.map((item:{name:string, url:string, imgName:string, imgUrl:string}) => {
      item.name = item.imgName
      item.url = item.imgUrl
      return item
    })
  } catch (error) {
    ElMessage.error(error)
  }
}
// 接收子组件传递过来的自定义事件，获取更新后scene的值，显示SPU列表
function changeScene (val:number, id:number) {
  scene.value = val
  if (id) {
    GETSPUINFO(category3Id.value, pageSize.value, currentPage.value)
  } else {
    currentPage.value = 1
    GETSPUINFO(category3Id.value, pageSize.value)
  }
}
</script>
<script lang="ts">
export default {
  name: 'MySpu'
}
</script>

<style></style>
