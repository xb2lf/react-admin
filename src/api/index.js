/* 
 *  包含n个接口请求函数的模块
 *  每个函数返回promise
 */
import jsonp from 'jsonp'
import { message } from 'antd'
import ajax from './ajax'

//登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

/* 
 * json请求的接口请求函数
 */
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


