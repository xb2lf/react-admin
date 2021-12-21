import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
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
  getmenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.map((item) => {
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
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      }
    });
  };
  getmenuNodeTree = (menuList) => {
    return menuList.reduce((prev, item) => {
      if (!item.children) {
        prev.push(
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
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
          {/* {this.getmenuNodeTree(menuList)} */}
        </Menu>
      </div>
    );
  }
}

export default withRouter(LeftNav);
