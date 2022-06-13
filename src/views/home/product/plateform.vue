<template>
  <div class="plateform-container">
    <MyCart
      :isDisabled="isDisabled"
      @getHide="getHide"
      @getCategory1="getCategory1Id"
      @getCategory2="getCategory2Id"
      @getCategory3="getCategory3Id"
      @getAttrList="getAttrList"
    ></MyCart>
    <el-card>
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="Plus"
          size="large"
          style="margin-bottom: 10px"
          @click="addValue"
          :disabled="hide"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性名称" width="180" align="center">
            <template #default="{ row }">
              {{ row.attrName }}
            </template>
          </el-table-column>
          <el-table-column label="属性值列表" header-align="center">
            <template #default="{ row }">
              <el-tag
                class="ml-2"
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="Operations" width="180" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                @click="handleEdit(row)"
                type="warning"
                icon="EditPen"
              ></el-button>
              <el-button
                size="small"
                type="danger"
                icon="Delete"
                @click="handleDelete()"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form-item label="属性名">
          <el-input
            v-model.trim="attrInfo.attrName"
            placeholder="请输入属性名"
            style="width: 180px"
            :disabled="istrue"
          />
        </el-form-item>
        <el-button
          type="primary"
          icon="Plus"
          size="large"
          style="margin-bottom: 10px"
          @click="addAttrValue"
          :disabled="disabled1"
          >添加属性值</el-button
        >
        <el-button size="large" @mousedown.prevent="cancel">取消</el-button>
        <el-table
          style="width: 100%; margin-bottom: 10px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="{ row, $index }">
              <el-input
                placeholder="请输入属性值名"
                v-if="row.flag"
                v-model.trim="row.valueName"
                :ref="
                  (el) => {
                    if (el) REFs[$index] = el;
                  }
                "
                @blur="blur(row, $index)"
                @keydown.enter="blur(row, $index)"
              ></el-input>
              <span
                @click="changeEdit(row, $index)"
                v-else
                style="display: block; width: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操做" align="center">
            <template #default="{ $index }">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="是否删除此属性值?"
                @confirm="confirmEvent($index)"
                @cancel="cancelEvent($index)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                  @mousedown="quit"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="large" type="primary" @click="saveAttr"
          >保存</el-button
        >
        <el-button size="large" @mousedown.prevent="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { attrInfoList, saveAttrInfo } from '@/API/product/plateform.js'
import { ref, reactive } from '@vue/reactivity'
import { ElMessage } from 'element-plus'
import { nextTick, watchEffect } from '@vue/runtime-core'
import { cloneDeep } from 'lodash'
const REFs = ref([])
const category1 = ref(null)
const category2 = ref(null)
const category3 = ref(null)
const attrList = ref([])
const isDisabled = ref(false)
const isShow = ref(true)
const istrue = ref(false)
const attrInfo = reactive({
  attrName: '',
  attrValueList: [],
  categoryId: 0,
  categoryLevel: 3,
  id: undefined
})
const cancelBlur = ref(false)
const save = ref(true)
const hide = ref(null)
const getHide = function (val: boolean) {
  hide.value = val
}
const getCategory1Id = function (val: number) {
  category1.value = val
}
const getCategory2Id = function (val: number) {
  category2.value = val
}
const getCategory3Id = function (val: number) {
  category3.value = val
}
const getAttrList = function (val: []) {
  attrList.value = val
}
const disabled1 = ref(true)
watchEffect(() => {
  if (attrInfo.attrName) {
    disabled1.value = false
  } else {
    disabled1.value = true
  }
})
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
function handleEdit (row: { attrName: string; attrValueList: []; id: number }) {
  cancelBlur.value = false
  attrInfo.categoryId = category3.value
  attrInfo.attrName = row.attrName
  attrInfo.id = row.id
  const clone = cloneDeep(row.attrValueList)
  attrInfo.attrValueList = clone
  isDisabled.value = true
  istrue.value = true
  isShow.value = false
}
function handleDelete () {
  console.log(123)
}
function confirmEvent (index: number) {
  attrInfo.attrValueList.splice(index, 1)
  cancelBlur.value = false
  save.value = true
}
function cancelEvent (index:number) {
  cancelBlur.value = false
  REFs.value[index].focus()
}
function quit () {
  cancelBlur.value = true
}
function addAttrValue () {
  if (save.value) {
    attrInfo.categoryId = category3.value
    const attrId = attrInfo.attrValueList[0] || {}
    attrInfo.attrValueList.push({
      attrId: attrId.attrId,
      valueName: '',
      flag: true
    })
    const length = attrInfo.attrValueList.length
    nextTick(() => {
      REFs.value[length - 1].focus()
    })
  }
}
function saveAttr () {
  if (attrInfo.attrValueList.length === 0) {
    ElMessage.error('请添加属性值')
  } else {
    save.value && saveAttrValue()
  }
}
async function saveAttrValue () {
  try {
    await saveAttrInfo(attrInfo)
    getAttrInfoList(category3.value)
    cancel()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
function addValue () {
  isShow.value = false
  isDisabled.value = true
  istrue.value = false
  cancelBlur.value = false
}
function cancel () {
  isShow.value = true
  cancelBlur.value = true
  attrInfo.attrName = ''
  attrInfo.attrValueList = []
  attrInfo.id = undefined
  isDisabled.value = false
  save.value = true
}
function blur (row: { valueName: string; flag: boolean }, index: number) {
  cancelBlur.value || blurHandler(row, index)
}
function blurHandler (row: { valueName: string; flag: boolean }, index: number) {
  const isRepeat = attrInfo.attrValueList
    .filter((item) => {
      return item !== row
    })
    .some((item) => {
      return item.valueName === row.valueName
    })
  if (row.valueName) {
    if (!isRepeat) {
      row.flag = false
      save.value = true
    } else {
      ElMessage.error('值不能重复！')
      REFs.value[index].focus()
      save.value = false
    }
  } else {
    ElMessage.error('值不能为空！')
    REFs.value[index].focus()
    save.value = false
  }
}
function changeEdit (row: { flag: boolean }, index: number) {
  if (save.value) {
    row.flag = true
    nextTick(() => {
      REFs.value[index].focus()
    })
  }
}
</script>
<script lang="ts">
export default {
  name: 'plateForm'
}
</script>

<style lang="less" scoped>
.plateform-container {
  margin: 10px;
  .el-card {
    margin-bottom: 10px;
  }
  .el-tag {
    margin-right: 10px;
  }
}
</style>
