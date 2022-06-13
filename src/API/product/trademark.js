import request from '@/utils/request'
export const getTradeInfo = (page, limit) => request.get(`/product/baseTrademark/${page}/${limit}`)
export const addOrUpdateTrademark = (trademark) => {
  if (trademark.id) {
    // 修改品牌
    return request.put('/product/baseTrademark/update', trademark)
  } else {
    // 新增品牌
    return request.post('/product/baseTrademark/save', trademark)
  }
}
export const removeTrademark = (id) => request.delete(`/product/baseTrademark/remove/${id}`)
