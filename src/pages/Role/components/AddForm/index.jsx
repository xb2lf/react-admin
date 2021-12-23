import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item;

export default class AddForm extends Component {
  static propTypes = {
    addRoleName: PropTypes.func.isRequired
  }
  handleInput = (changedValues, allValues) => {
    this.props.addRoleName(changedValues.roleName)
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal" onValuesChange={this.handleInput} >
        <Item
          label="角色名称"
          name="roleName"
          initialValue=""
          rules={[
            { required: true, whitespace: true, message: "请输入角色名称！" },
          ]}
          {...formItemLayout}
        >
          <Input placeholder="请输入角色名称" />
        </Item>
      </Form>
    );
  }
}
