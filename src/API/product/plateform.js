import request from '@/utils/request.js'
export const getCategory1List = () => request.get('/product/getCategory1')
export const getCategory2List = (category1Id) => request.get(`/product/getCategory2/${category1Id}`)
export const getCategory3List = (category2Id) => request.get(`/product/getCategory3/${category2Id}`)
export const attrInfoList = (Id1, Id2, Id3) => request.get(`/product/attrInfoList/${Id1}/${Id2}/${Id3}`)
export const saveAttrInfo = (data) => request.post('/product/saveAttrInfo', data)
