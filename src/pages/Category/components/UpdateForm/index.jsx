import React, { Component, createRef } from "react";
import { Form, Input } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item;
export default class UpdateForm extends Component {
  formRef = createRef()
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    updateCateporyName: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.formRef.current.resetFields();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.categoryName !== this.props.categoryName) {
      this.formRef.current.setFieldsValue({
        categoryName: nextProps.categoryName,
      })
    }
  }
  handleInput = (changedValues, allValues) => {
    if (!changedValues.categoryName) {
      this.props.updateCateporyName(changedValues.categoryName, false);
      return;
    }
    this.props.updateCateporyName(changedValues.categoryName, true);
  }
  render() {
    const { categoryName } = this.props;
    return (
      <Form layout="vertical" ref={this.formRef} onValuesChange={this.handleInput}>
        <Item
          label="分类名称"
          name="categoryName"
          initialValue={categoryName}
          rules={[
            { required: true, whitespace: true, message: "请输入分类名称！" },
          ]}
        >
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>
    );
  }
}
