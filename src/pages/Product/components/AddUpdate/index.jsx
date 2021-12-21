import React, { Component } from "react";
import { Card, Form, Input, Cascader, Upload, Button, message } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { LinkButton } from "../../../../components";
import { reqCategorys } from '../../../../api'
import "./index.less";

const { Item } = Form;
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {
  state = {
    options: [],
    parentId: '0',
  }
  componentDidMount() {
    const { parentId } = this.state
    this.getCategorys(parentId);
  }
  validattePrice = (rule, value) => {
    if (value * 1 > 0) {
      return Promise.resolve()
    } else {
      return Promise.reject('商品价格必须大于0哦')
    }
  }
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map(el => ({
        value: el._id,
        label: el.name,
        isLeaf: true,
      }));
      targetOption.children = childOptions;
    } else {
      targetOption.isLeaf = true;
    }
    this.setState({ options: [...this.state.options] });
  };
  getCategorys = async (parentId) => {
    const res = await reqCategorys(parentId);
    if (res.status === 0) {
      const categorys = res.data;
      if (parentId === '0') {
        this.initOptions(categorys);
      } else {
        return categorys;
      }
    } else {
      message.warning('请求分类失败，请稍后再试')
    }
  }
  initOptions = (categorys) => {
    const options = categorys.map(el => ({
      value: el._id,
      label: el.name,
      isLeaf: false
    }));
    this.setState({ options })
  }
  handleJumpHome = () => {
    this.props.history.goBack();
  };
  handleSubmit = async (values) => {
    console.log(values);
  };
  handleSubmitFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  render() {
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            className="back-arrow"
            onClick={this.handleJumpHome}
          />
        </LinkButton>
        <span>添加商品</span>
      </span>
    );
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    return (
      <Card title={title} className="add-product">
        <Form {...formItemLayout} onFinish={this.handleSubmit} onFinishFailed={this.handleSubmitFailed} initialValues={{
          remember: true,
        }}>
          <Item
            label="商品名称"
            name="name"
            rules={[
              { required: true, whitespace: true, message: "请输入商品名称！" },
            ]}
            initialValue={""}
          >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item
            label="商品描述"
            name="desc"
            rules={[
              { required: true, whitespace: true, message: "请输入商品描述！" },
            ]}
            initialValue={""}
          >
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              showCount
              maxLength={500}
              placeholder="请输入商品描述"
              className="add-textarea"
            />
          </Item>
          <Item
            label="商品价格"
            name="price"
            rules={[
              { required: true, whitespace: true, message: "请输入商品价格！" },
              { validator: this.validattePrice }
            ]}
            initialValue={""}
          >
            <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
          </Item>
          <Item
            label="商品分类"
            name="category"
            rules={[{ required: true, message: "请选择商品分类！" }]}
            initialValue={''}
          >
            <Cascader options={this.state.options} loadData={this.loadData} changeOnSelect />
          </Item>
          <Item
            label="商品图片"
            name="imgs"
            rules={[{ required: true, message: "请上传商品图片" }]}
            initialValue={""}
          >
            <div>上传图片</div>
          </Item>
          <Item
            label="商品详情"
            name="detail"
            rules={[
              { required: true, whitespace: true, message: "请输入商品详情！" },
            ]}
            initialValue={""}
          >
            <Input placeholder="请输入商品详情" />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
