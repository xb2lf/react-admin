import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { login } from '../../redux/actions'
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.less";
import logo from "../../assets/images/logo.png";


const Item = Form.Item;
class Login extends Component {
  handleSubmit = async (values) => {
    const { username, password } = values;
    this.props.login(username, password);
    /* if () {
      message.success('登陆成功')
      this.props.history.replace('/home');
    } else {
      message.error(result.msg)
    } */
  };
  handleSubmitFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 自定义规则验证密码 antd v3
  /* validattePwd = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码！');
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或者下划线组成')
    } else {
      callback()
    }
  } */

  // 自定义规则验证密码 antd v4
  validattePwd = (rule, value) => {
    if (!value) {
      return Promise.reject('请输入密码！');
    } else if (value.length < 4) {
      return Promise.reject('密码长度不能小于4位')
    } else if (value.length > 12) {
      return Promise.reject('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject('密码必须是英文、数字或者下划线组成')
    } else {
      return Promise.resolve()
    }
  }
  render() {
    const user = this.props.user;
    if (user && user._id) {
      return <Redirect to="/home" />
    }
    const errorMsg = this.props.user.errorMsg;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={errorMsg ? 'error-msg show' :
            'error-msg'}>{errorMsg}</div>
          <h2>用户登录</h2>
          <Form
            onFinish={this.handleSubmit}
            className="login-form"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            onFinishFailed={this.handleSubmitFailed}
          >
            <Item
              name="username"
              rules={[
                { required: true, whitespace: true, message: "请输入用户名！" },
                { min: 2, message: '用户名至少4位' },
                { max: 12, message: '用户名至多12位' },
                { pattern: /^[u4e00-u9fa5_a-zA-Z0-9]+$/, message: '用户名必须是中英文、数字或者下划线组成' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="用户名"
              />
            </Item>
            <Item
              name="password"
              rules={[{ validator: this.validattePwd }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="密码"
              />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({ user: state.user }),
  { login }
)(Login);
