/* 
 *  包含n个接口请求函数的模块
 *  每个函数返回promise
 */
import jsonp from 'jsonp'
import { message } from 'antd'
import ajax from './ajax';

const BASE = '';
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


