<template>
  <el-form
    ref="ruleFormRef"
    class="demo-ruleForm"
    label-width="80px"
    :model="ruleForm"
    :rules="rules"
  >
    <el-form-item label="SPU名称" prop="spuName">
      <el-input placeholder="SPU名称" v-model="ruleForm.spuName" />
    </el-form-item>
    <el-form-item label="品牌" prop="tmId">
      <el-select v-model="ruleForm.tmId" placeholder="请选择品牌"  @change="tmchange">
        <el-option
          v-for="item in trademarkList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述" prop="description">
      <el-input
        type="textarea"
        rows="4"
        placeholder="SPU描述"
        v-model="ruleForm.description"
      />
    </el-form-item>
    <el-form-item label="SPU图片" prop="spuImageList">
      <el-upload
        action="/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-success="handPictureSuccess"
        :file-list="ruleForm.spuImageList"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性" prop="spuSaleAttrList">
      <el-select :placeholder="`还有${unSelectAttr.length}个属性`" v-model="ruleForm.baseSaleAttrInfo">
        <el-option
          :label="item.name"
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectAttr"
          :key="item.id"
        />
      </el-select>
      <el-button type="primary" icon="Plus" :disabled="!ruleForm.baseSaleAttrInfo" @click="addSaleAttr">添加销售属性</el-button>
      <el-table
        border
        highlight-current-row
        :data="ruleForm.spuSaleAttrList"
      >
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        />
        <el-table-column label="属性名" align="center" width="120px">
          <template #default="{ row }">
            {{ row.saleAttrName }}
          </template>
        </el-table-column>
        <el-table-column label="属性值名称列表" align="center">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag.id"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(row.spuSaleAttrValueList,tag)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.inputVisible"
              ref="InputRef"
              v-model.trim="row.inputValue"
              class="ml-1 w-20"
              size="small"
              style="width:65px"
              @keyup.enter="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <el-button
              v-else
              class="button-new-tag ml-1"
              size="small"
              @click="showInput(row)"
            >
              添加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template #default={$index}>
            <el-button type="danger" icon="Delete" @click="ruleForm.spuSaleAttrList.splice($index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >保存</el-button
      >
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, defineEmits, reactive, defineProps, watch, nextTick, computed } from 'vue'
import type {
  UploadProps,
  UploadUserFile,
  FormInstance,
  FormRules,
  ElInput
} from 'element-plus'
import { reqTradeMarkList, reqBaseSaleAttrList, reqOrupdateSpu } from '@/API/product/spu.js'
import { ElMessage } from 'element-plus'
// 定义自定义事件
const emit = defineEmits(['changeScene'])
// props属性
const props = defineProps(['spuList', 'SpuImageList', 'category3Id'])
// 表单的数据
const ruleForm = reactive({
  category3Id: undefined,
  spuName: '',
  description: '',
  id: undefined,
  tmId: null,
  spuImageList: ref<UploadUserFile[]>([]),
  spuSaleAttrList: [],
  baseSaleAttrInfo: undefined
})
const trademarkList = ref([]) // 品牌列表信息
const baseSaleAttrList = ref([]) // 全部销售属性信息
const unSelectAttr = computed(() => {
  return baseSaleAttrList.value.filter((item:{name:string}) => {
    return ruleForm.spuSaleAttrList.every((item1:{saleAttrName:string}) => {
      return item1.saleAttrName !== item.name
    })
  })
})
// 获取category3Id
watch(() => props.category3Id, (newVal) => {
  ruleForm.category3Id = newVal
})
// 监听父组件传递过来的spuList,更新spuName，description
watch(
  () => props.spuList,
  (newVal) => {
    ruleForm.spuName = newVal.spuName
    ruleForm.description = newVal.description
    ruleForm.tmId = newVal.tmId
    ruleForm.spuSaleAttrList = newVal.spuSaleAttrList
    ruleForm.id = newVal.id
  }
)
// 监听父组件传递过来的SpuImageList,更新SpuImageList
watch(() => props.SpuImageList, (newVal) => {
  newVal.forEach((item:{imgUrl:string, imgName:string}) => {
    ruleForm.spuImageList.push({ name: item.imgName, url: item.imgUrl })
  })
}
)
const ruleFormRef = ref<FormInstance>() // 获取form表单元素
// 表单验证规则
const rules = reactive<FormRules>({
  spuName: [{ required: true, message: 'spuName不能为空', trigger: 'blur' }],
  tmId: [{ required: true, message: '请选择一个', trigger: 'click' }],
  description: [
    { required: true, message: 'description不能为空', trigger: 'blur' }
  ],
  spuImageList: [{ required: true, message: '至少上传一张图片' }],
  spuSaleAttrList: [
    { required: true, message: '至少有一个销售属性', trigger: 'change' }
  ]
})
// 获取品牌列表
async function tradeMarkList () {
  try {
    const { data } = await reqTradeMarkList()
    trademarkList.value = data
  } catch (error) {
    ElMessage.error(error)
  }
}
tradeMarkList() // 调用方法，获取品牌列表
async function BaseSaleAttrList () {
  try {
    const { data } = await reqBaseSaleAttrList()
    baseSaleAttrList.value = data
  } catch (error) {
    ElMessage.error(error)
  }
}
// 品牌发生改变，移除品牌校验字段
function tmchange () {
  ruleFormRef.value.clearValidate(['tmId'])
}
BaseSaleAttrList() // 调用方法，获取平台的全部销售属性
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 照片墙预览
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
// 图片上传成功，移除图片的校验字段
const handPictureSuccess: UploadProps['onSuccess'] = (uploadFile) => {
  ruleFormRef.value.clearValidate(['spuImageList'])
}
// 点击保存
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const spuImageList = ruleForm.spuImageList.map(item => {
        return { imgName: item.name, imgUrl: (item.response && (item.response as {data:string}).data) || item.url, name: undefined }
      })
      ruleForm.spuImageList.splice(0)
      spuImageList.forEach(item => {
        ruleForm.spuImageList.push(item)
      })
      try {
        await reqOrupdateSpu(ruleForm)
        ElMessage.success('保存成功')
        cancel()
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}
// 点击取消，触发changeScene事件，向父组件传值（scene的值）
const cancel = () => {
  ruleForm.spuImageList.splice(0)
  emit('changeScene', 0, ruleForm.id)
  ruleFormRef.value.clearValidate()
  Object.assign(ruleForm, {
    spuName: '',
    description: '',
    id: undefined,
    tmId: null,
    spuSaleAttrList: [],
    baseSaleAttrInfo: undefined
  })
}
// 添加销售属性
function addSaleAttr () {
  const baseSaleAttrInfo = ruleForm.baseSaleAttrInfo.split(':')
  const baseSaleAttrId = baseSaleAttrInfo[0]
  const saleAttrName = baseSaleAttrInfo[1]
  ruleForm.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] })
  ruleForm.baseSaleAttrInfo = undefined
}
// el-tag的业务操作
const InputRef = ref<InstanceType<typeof ElInput>>()
// 关闭标签
const handleClose = (spuSaleAttrValueList:object[], tag: object) => {
  spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(tag), 1)
}
// 显示input
const showInput = (row:{inputVisible:boolean, inputValue:string}) => {
  row.inputVisible = true
  row.inputValue = ''
  nextTick(() => {
    InputRef.value.input.focus()
  })
}
// input失去焦点添加属性值名称
const handleInputConfirm = (row:{inputVisible:boolean, inputValue:string, spuSaleAttrValueList:{baseSaleAttrId:string, saleAttrValueName:string}[], baseSaleAttrId:string}) => {
  if (row.inputValue) {
    const noRepeat = row.spuSaleAttrValueList.every((item:{saleAttrValueName:string}) => {
      return item.saleAttrValueName !== row.inputValue
    })
    if (noRepeat) {
      const baseSaleAttrId = row.baseSaleAttrId
      const saleAttrValueName = row.inputValue
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName })
    }
  }
  row.inputVisible = false
}
</script>
<script lang="ts">
export default {
  name: 'SpuForm'
}
</script>

<style scoped>
.mx-1 {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}
</style>
