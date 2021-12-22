import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { LinkButton } from "../../../../components";
import {
  reqProducts,
  reqSearchProducts,
  reqUpdateStatus,
} from "../../../../api";
import { PAGE_SIZE } from "../../../../utils/constants";
import "./index.less";

const Option = Select.Option;

export default class ProductHome extends Component {
  state = {
    products: [],
    total: 0,
    pageSize: 5,
    loading: false,
    currPageNum: 1,
    searchName: "",
    searchType: "productName",
  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    const { currPageNum, pageSize } = this.state;
    this.getProducts(currPageNum, pageSize);
  }
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
        width: "30%",
        className: "product-name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
        width: "70%",
        className: "product-desc",
      },
      {
        title: "价格",
        width: 90,
        dataIndex: "price",
        render: (price) => "￥" + price, //当前指定了对应的属性，传入的是对应的属性值
      },
      {
        title: "状态",
        // dataIndex:'status',
        width: 100,
        render: (product) => {
          const { status, _id } = product;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.handleUpdateStatus(_id, status)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        title: "操作",
        width: 100,
        render: (product) => (
          <span>
            <LinkButton onClick={() => this.handleJumpDetail(product)}>
              详情
            </LinkButton>
            <LinkButton onClick={() => this.handleJumpUpdate(product)}>修改</LinkButton>
          </span>
        ),
      },
    ];
  };
  handleJumpDetail = (product) => {
    /*  this.props.history.push({ pathname: '/product/detail', state: { product: product } }) */
    this.props.history.push("/product/detail", { product });
  };
  getProducts = async (pageNum, pageSize) => {
    this.setState({ loading: true });
    const { searchName, searchType } = this.state;
    let res;
    if (searchName) {
      res = await reqSearchProducts(pageNum, pageSize, searchName, searchType);
    } else {
      res = await reqProducts(pageNum, pageSize);
    }
    this.setState({ loading: false });
    if (res.status === 0 && res.data) {
      const { list, total } = res.data;
      this.setState({
        total,
        products: list,
      });
    } else {
      message.warning("请求商品列表失败，请稍后再试");
    }
  };
  handleShowTotal = (total, range) => {
    return <div>总共{total}条</div>;
  };
  handleChange = (page, pageSize) => {
    this.setState({ currPageNum: page, pageSize }, () => {
      this.getProducts(page, pageSize);
    });
  };
  handleShowSizeChange = (current, size) => {
    this.setState({ currPageNum: current, pageSize: size }, () => {
      this.getProducts(current, size);
    });
  };
  handleItemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <LinkButton>上一页</LinkButton>;
    }
    if (type === "next") {
      return <LinkButton>下一页</LinkButton>;
    }
    return originalElement;
  };
  handleSelectChange = (value, option) => {
    this.setState({ searchType: value });
  };
  handleInputChange = (e) => {
    this.setState({ searchName: e.target.value });
  };
  handleSearch = () => {
    const { currPageNum, pageSize } = this.state;
    this.getProducts(currPageNum, pageSize);
  };
  handleUpdateStatus = async (productId, status) => {
    const currStatus = status === 1 ? 2 : 1;
    const statusText = status === 1 ? "下架" : "上架";
    const { currPageNum, pageSize } = this.state;
    const res = await reqUpdateStatus(productId, currStatus);
    if (res.status === 0) {
      message.success(`商品${statusText}成功`);
      this.getProducts(currPageNum, pageSize);
    } else {
      message.warning(`商品${statusText}失败，请稍后再试`);
    }
  };
  handleJumpAdd = () => {
    this.props.history.push('/product/addUpdate');
  };
  handleJumpUpdate = (product) => {
    this.props.history.push('/product/addUpdate', product);
  }
  render() {
    const {
      products,
      loading,
      total,
      pageSize,
      currPageNum,
      searchName,
      searchType,
    } = this.state;
    const title = (
      <span>
        <Select
          value={searchType}
          className="product-home-select"
          onChange={this.handleSelectChange}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          className="product-home-input"
          value={searchName}
          onChange={this.handleInputChange}
        />
        <Button type="primary" onClick={this.handleSearch}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.handleJumpAdd}
      >
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra} className="product-home">
        <Table
          dataSource={products}
          columns={this.columns}
          rowKey="_id"
          bordered
          loading={loading}
          pagination={{
            onChange: this.handleChange,
            onShowSizeChange: this.handleShowSizeChange,
            hideOnSinglePage: false,
            defaultPageSize: PAGE_SIZE,
            pageSize: pageSize,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: this.handleShowTotal,
            current: currPageNum,
            showLessItems: true,
            itemRender: this.handleItemRender,
            total: total,
          }}
          scroll={{ scrollToFirstRowOnChange: true, y: "570px", x: "930px" }}
        />
      </Card>
    );
  }
}
