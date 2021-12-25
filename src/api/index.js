/* 
 *  包含n个接口请求函数的模块
 *  每个函数返回promise
 */
import jsonp from 'jsonp'
import { message } from 'antd'
import ajax from './ajax';

const BASE = '/api';
//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

/* 
 * json请求的接口请求函数
 * @  params
 * key ampap应用key值（webserver）
 * city 城市或县区对应的acode值
 * extensions all(白天加夜间天气预报) base(实时天气信息)
 * output json/xml
 */
//请求实时天气
export const reqWeather = (acode) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=d11dcf595cf68b78297c25783eb3f2c2&city=${acode}&extensions=base&output=json`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === '1') {
        const { weather } = data.lives[0];
        resolve(weather)
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
}

//请求一级/二级品类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId }, 'GET')

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

//更新分类名称
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax(BASE + '/manage/category/update', { categoryName, categoryId }, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize }, 'GET')

//搜索商品分页列表
/* 
 * @ params
 *   productName/productDesc
 */
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax(BASE + '/manage/product/search', { pageNum, pageSize, [searchType]: searchName }, 'GET')

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId }, 'GET')

//更新商品状态

export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

//删除已上传图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加商品/更新商品
/* 
 * params 
 * product是一个对象，包含:name,desc,price,PcategoryId,categoryId,imgs,detail
 * 其中imgs代表商品图片，可能一张也可能多张，数组形式
 * 如果是添加商品则不包含_id,如果是更新商品则需指定_id
 */
export const reqAddOrUpdateProduct = (product) => ajax(BASE + `/manage/product/${product._id ? 'update' : 'add'}`, product, 'POST')

// 获取角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddrole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

//更新角色
export const reqUpdaterole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + `/manage/user/${user._id ? 'update' : 'add'}`, user, 'POST')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')


