import request from './config/request'

export default {
  // 获取信息列表
  getList(data) {
    return request.post('/data/list', data)
  },
  // 获取信息列表(分页))
  getData(data) {
    return request.post('/data/listPage', data)
  },
  // 根据id获取单个信息
  getById(params) {
    return request.get('/data/getById', { params })
  },
  // 删除信息
  delete(data) {
    return request.post('/data/delete', data)
  },
  // 批量删除信息
  deleteBatch(data) {
    return request.post('/data/deleteBatch', data)
  },
  // 新增信息
  save(data) {
    return request.post('/data/save', data)
  },
  // 更新
  update(data) {
    return request.post('/data/update', data)
  }
}
