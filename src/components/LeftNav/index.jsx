import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { Menu } from "antd";
import { setHeadTitle } from '../../redux/actions'
import { menuList, defaultSelectedKeys } from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";

const { SubMenu } = Menu;

class LeftNav extends Component {
  state = {
    collapsed: false,
  };
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getmenuNodes(menuList);
  }
  /* 
   * 判断当前登录用户对item是否有权限
   * 1. admin 
   * 2. 当前item是公共的
   * 3. 当前用户由此item的权限
   * 4. 如果当前用户有此item的子项的权限
   */
  hasAuth = (item) => {
    const { key, isPublic } = item;
    const { user } = this.props;
    const menus = user.role.menus;
    const username = user.username;
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    } else {
      return false
    }
  }
  getmenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.map((item) => {
      if (this.hasAuth(item)) {
        if (item.children) {
          const cItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0);
          if (cItem) {
            this.openKey = item.key;
          }
          return (
            <SubMenu
              key={item.key}
              collapsed="false"
              icon={item.icon}
              title={item.title}
            >
              {this.getmenuNodes(item.children)}
            </SubMenu>
          );
        } else {
          if (item.key === path || path.indexOf(item.key) === 0) {
            this.props.setHeadTitle(item.title);
          }
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
            </Menu.Item>
          );
        }
      }
    });
  };
  getmenuNodeTree = (menuList) => {
    return menuList.reduce((prev, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          prev.push(
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          prev.push(
            <SubMenu
              key={item.key}
              collapsed="false"
              icon={item.icon}
              title={item.title}
            >
              {this.getmenuNodeTree(item.children)}
            </SubMenu>
          );
        }
      }
      return prev;
    }, []);
  };
  render() {
    let path = this.props.location.pathname;
    if (path.indexOf('/product') === 0) {
      path = '/product';
    }
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>浣熊后台</h1>
        </Link>
        <Menu
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={[openKey]}
          selectedKeys={[path]}
          mode="inline"
          theme="dark"
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user })

const mapDispatchToProps = dispatch => ({
  setHeadTitle: title => dispatch(setHeadTitle(title))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftNav));
