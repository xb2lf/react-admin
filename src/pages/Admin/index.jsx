import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Header, LeftNav } from '../../components'
import { Home, Category, Product, User, Role, Bar, Line, Pie } from '../index'
import './index.less'

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  render() {
    const user = this.props.user
    // 如果store没有存储user => 当前没有登录
    if (!user || !user._id) {
      //自动跳转到登录（在render）
      return <Redirect to="/login" />
    }
    return (
      <Layout className='layout'>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content className='layout-content'>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/user" component={User} />
              <Route path="/role" component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/line" component={Line} />
              <Route path="/charts/pie" component={Pie} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer className='layout-footer'>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(state => ({ user: state.user }))(Admin)
