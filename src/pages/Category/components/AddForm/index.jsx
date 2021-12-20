import React, { Component, createRef } from "react";
import { Form, Select, Input } from "antd";
import PropTypes from 'prop-types'

const Item = Form.Item;
const Option = Select.Option;

export default class AddForm extends Component {
  formRef = createRef()
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    addCateporyName: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.formRef.current.resetFields();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.parentId !== this.props.parentId) {
      this.formRef.current.setFieldsValue({
        parentId: nextProps.parentId,
      })
    }
  }
  handleInput = (changedValues, allValues) => {
    if (!allValues.categoryName || !allValues.parentId) {
      this.props.addCateporyName(allValues.parentId, allValues.categoryName, false)
      return;
    }
    this.props.addCateporyName(allValues.parentId, allValues.categoryName, true)
  }
  render() {
    const { categorys, parentId } = this.props
    return (
      <Form layout="vertical" ref={this.formRef} onValuesChange={this.handleInput}>
        <Item
          label="所属分类"
          name="parentId"
          initialValue={parentId}
          rules={[
            { required: true, whitespace: true, message: "请输入用户名！" },
          ]}
        >
          <Select>
            <Option value="0">一级分类</Option>
            {
              categorys.map(item => (
                <Option key={item._id} value={item._id}>{item.name}</Option>
              ))
            }
          </Select>
        </Item>
        <Item
          label="分类名称"
          name="categoryName"
          initialValue=""
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
