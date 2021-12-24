import { combineReducers } from "redux";
import { getUser } from "../utils/storageUtils";
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from "./action-types";

const initHeadTitle = "首页";
const headTitle = (state = initHeadTitle, action) => {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data;
    default:
      return state;
  }
};

const initUser = getUser();
const user = (state = initUser, action) => {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg;
      return { ...state, errorMsg };
    case RESET_USER:
      return {}
    default:
      return state;
  }
};

/*
 * 向外暴露的是合并产生的总的reuducer函数
 * 管理总的state的结构：
 * {
 *   headTitle:'首页',
 *   user:{}
 *  }
 */
const reducer = combineReducers({ headTitle, user });

export default reducer;
