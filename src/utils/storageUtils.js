/* 
 * 进行local数据存储管理的工具模块
 */
import store from "store";

const USER_KEY = 'user_key';

//保存user
function saveUser(user) {
  store.set(USER_KEY, user)
}

//读取user
function getUser() {
  return store.get(USER_KEY) || {}
}

//删除user
function removeUser() {
  store.remove(USER_KEY)
}

export {
  saveUser,
  getUser,
  removeUser
}