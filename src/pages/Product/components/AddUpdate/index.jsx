import React, { PureComponent, createRef } from "react";
import { Card, Form, Input, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { LinkButton, PicturesWall, RichTextEditor } from "../../../../components";
import { reqCategorys, reqAddOrUpdateProduct } from '../../../../api'
import memoryUtils from "../../../../utils/memoryUtils";
import "./index.less";

const { Item } = Form;
const { TextArea } = Input;

export default class ProductAddUpdate extends PureComponent {
  upPicture = createRef(null);
  editor = createRef(null);
  state = {
    options: [],
    parentId: '0',
    isUpdate: false,
    product: {},
  }
  UNSAFE_componentWillMount() {
    const product = memoryUtils.product;
    this.setState({ isUpdate: !!product._id, product: product || {} })
  }
  componentDidMount() {
    const { parentId } = this.state
    this.getCategorys(parentId);
  }
  // 在卸载之前清除保存的数据
  componentWillUnmount() {
    memoryUtils.product = {};
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
  initOptions = async (categorys) => {
    const options = categorys.map(el => ({
      value: el._id,
      label: el.name,
      isLeaf: false
    }));
    const { isUpdate, product } = this.state;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(pCategoryId);
      const childOptions = subCategorys.map(el => ({
        value: el._id,
        label: el.name,
        isLeaf: true,
      }));
      const targetOption = options.find(option => option.value === pCategoryId);
      targetOption.children = childOptions;
    }
    this.setState({ options })
  }
  handleJumpHome = () => {
    this.props.history.goBack();
  };
  handleSubmit = async (values) => {
    const { name, desc, price, categoryIds } = values;
    const { isUpdate } = this.state;
    let pCategoryId, categoryId;
    if (categoryIds.length === 1) {
      pCategoryId = '0';
      categoryId = categoryIds[0]
    } else {
      pCategoryId = categoryIds[0];
      categoryId = categoryIds[1];
    }
    const imgs = this.upPicture.current.getImgs();
    const detail = this.editor.current.getDetail();
    const product = { name, desc, price, pCategoryId, categoryId, imgs, detail };
    if (isUpdate) {
      product._id = this.state.product._id;
    }
    const res = await reqAddOrUpdateProduct(product);
    const msgText = isUpdate ? '更新' : '添加';
    if (res.status === 0) {
      message.success(`${msgText}商品成功`);
      this.props.history.goBack();
    } else {
      message.error(`${msgText}商品失败`);
    }
  };
  handleSubmitFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  render() {
    const { isUpdate, product } = this.state;
    const { pCategoryId, categoryId, imgs, detail } = product;
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(pCategoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            className="back-arrow"
            onClick={this.handleJumpHome}
          />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
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
            initialValue={product.name}
          >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item
            label="商品描述"
            name="desc"
            rules={[
              { required: true, whitespace: true, message: "请输入商品描述！" },
            ]}
            initialValue={product.desc}
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
              { required: true, message: "请输入商品价格！" },
              { validator: this.validattePrice }
            ]}
            initialValue={product.price}
          >
            <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
          </Item>
          <Item
            label="商品分类"
            name="categoryIds"
            rules={[{ required: true, message: "请选择商品分类！" }]}
            initialValue={categoryIds}
          >
            <Cascader placeholder="请选择商品分类" options={this.state.options} loadData={this.loadData} changeOnSelect />
          </Item>
          <Item
            label="商品图片"
            name="imgs"
          >
            <PicturesWall imgs={imgs} ref={this.upPicture} />
          </Item>
          <Item
            label="商品详情"
            name="detail"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 18 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
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
