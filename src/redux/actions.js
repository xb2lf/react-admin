import { message } from 'antd';
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types';
import { reqLogin } from '../api';
import { saveUser, removeUser } from '../utils/storageUtils'

export const setHeadTitle = (headTitle) => ({
  type: SET_HEAD_TITLE,
  data: headTitle
})

export const receiveUser = (user) => ({ type: RECEIVE_USER, user });

export const showErrorMsg = (errorMsg) => ({
  type: SHOW_ERROR_MSG,
  errorMsg
})

export const login = (username, password) => {
  return async dispatch => {
    const res = await reqLogin(username, password);
    if (res.status === 0) {
      message.success('登录成功')
      const user = res.data;
      saveUser(user); //保存到local中
      dispatch(receiveUser(user)); //保存到store中
    } else {
      const msg = res.msg;
      dispatch(showErrorMsg(msg));
    }
  }
}

export const logout = () => {
  removeUser();
  return { type: RESET_USER }
}