import React, { Component, createRef } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item;
const Option = Select.Option;
export default class AddForm extends Component {
  formRef = createRef()
  static propTypes = {
    roles: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.formRef.current.resetFields();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      const { username, phone, email, role_id } = nextProps.user;
      this.formRef.current.setFieldsValue({
        username: username || '',
        phone: phone || '',
        email: email || '',
        role_id: role_id || ''
      })
    }
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { roles, user } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} ref={this.formRef}>
        <Item
          label="用户名"
          name="username"
          initialValue={user.username}
          rules={[
            { required: true, whitespace: true, message: "请输入用户名称！" },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Item>
        <Item
          label="手机号"
          name="phone"
          initialValue={user.phone}
          rules={[
            { required: true, whitespace: true, message: "请输入手机号！" },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Item>
        <Item
          label="邮箱"
          name="email"
          initialValue={user.email}
          rules={[
            { required: true, whitespace: true, message: "请输入邮箱！" },
          ]}
        >
          <Input placeholder="请输入用户邮箱" />
        </Item>
        <Item
          label="角色"
          name="role_id"
          initialValue={user.role_id}
          rules={[
            { required: true, whitespace: true, message: "请选择对应角色！" },
          ]}>
          <Select>
            {
              roles.length && roles.map(role => (<Option value={role._id} key={role._id}>{role.name}</Option>))
            }
          </Select>
        </Item>
      </Form>
    );
  }
}
