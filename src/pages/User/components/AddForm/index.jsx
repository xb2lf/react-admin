import React, { Component, createRef } from "react";
import { Form, Input, Select } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;
const Passwrod = Input.Password;
export default class AddForm extends Component {
  formRef = createRef();
  static propTypes = {
    roles: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.setForm(this.formRef)
    this.formRef.current.resetFields();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      const { username, password, phone, email, role_id } = nextProps.user;
      this.formRef.current.setFieldsValue({
        username: username || "",
        password: password || "",
        phone: phone || "",
        email: email || "",
        role_id: role_id || undefined,
      });
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
            { min: 2, message: '用户名至少4位' },
            { max: 12, message: '用户名至多12位' },
            { pattern: /^[u4e00-u9fa5_a-zA-Z0-9]+$/, message: '用户名必须是中英文、数字或者下划线组成' },
          ]}
        >
          <Input placeholder="请输入用户名称" />
        </Item>
        {
          user._id ? null : <Item
            label="密码"
            name="password"
            initialValue={user.password}
            rules={[
              { required: true, whitespace: true, message: "请输入用户密码！" },
              { min: 4, message: "用户密码至少4位" },
              { max: 12, message: "用户密码至多12位" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户密码必须是英文、数字或者下划线组成",
              },
            ]}
          >
            <Passwrod
              placeholder="请输入用户密码"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Item>
        }
        <Item
          label="手机号"
          name="phone"
          initialValue={user.phone}
          rules={[
            { required: true, whitespace: true, message: "请输入手机号！" },
            { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[013678])|(18[0,5-9]))\d{8}$/, message: '您输入的手机号不合法' }
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
            { pattern: /^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/, message: '您输入的邮箱不合法' }
          ]}
        >
          <Input placeholder="请输入用户邮箱" />
        </Item>
        <Item
          label="角色"
          name="role_id"
          initialValue={user.role_id}
          rules={[
            { required: true, whitespace: true, message: "请选择角色！" },
          ]}
        >
          <Select placeholder="请选择角色">
            {roles.length &&
              roles.map((role) => (
                <Option value={role._id} key={role._id}>
                  {role.name}
                </Option>
              ))}
          </Select>
        </Item>
      </Form>
    );
  }
}
