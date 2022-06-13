import request from '@/utils/request.js'
// 获取SPU列表数据的接口
export const getSpuInfo = (page, limit, category3Id) => request.get(`/product/${page}/${limit}`, {
  params: {
    category3Id
  }
})
// 获取SPU信息的接口
export const reqSpu = (spuId) => request.get(`/product/getSpuById/${spuId}`)
// 获取品牌的信息的接口
export const reqTradeMarkList = () => request.get('/product/baseTrademark/getTrademarkList')
// 获取SPU图标的接口
export const reqSpuImageList = (spuId) => request.get(`/product/spuImageList/${spuId}`)
// 获取平台的全部销售属性的接口（最多3个）
export const reqBaseSaleAttrList = () => request.get('/product/baseSaleAttrList')
export const reqOrupdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request.post('/product/updateSpuInfo', spuInfo)
  } else {
    return request.post('/product/saveSpuInfo', spuInfo)
  }
}
