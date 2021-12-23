import React, { Component, createRef } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { LinkButton } from "../../components";
import { AddForm, UpdateForm } from "./components";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
export default class Category extends Component {
  addCategoryFrom = createRef(null);
  upCategory = createRef(null);
  state = {
    categorys: [],
    subCategorys: [],
    currPageNum: 1,
    total: 0,
    pageSize: 5,
    loading: false,
    parentId: '0',
    parentName: '',
    showStatus: 0, //确认添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    categoryId: '',
    categoryName: '',

  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getCategorys();
  }
  initColumns = () => {
    this.columns = [
      {
        title: "分类",
        dataIndex: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.handleShowUpdateModal(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" && (
              <LinkButton onClick={this.handleShowSubCategorys(category)}>
                查看子分类
              </LinkButton>
            )}
          </span>
        ),
      },
    ];
  };
  //获取一级/二级分类列表
  getCategorys = async () => {
    this.setState({ loading: true });
    const { parentId } = this.state;
    const res = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (res.status === 0) {
      const categorys = res.data;
      if (parentId === "0") {
        this.setState({ categorys, total: categorys.length });
      } else {
        this.setState({ subCategorys: categorys, total: categorys.length });
      }
    } else {
      message.warning("获取分类列表失败");
    }
  };
  handleShowTotal = (total, range) => {
    return <div>总共{total}条</div>;
  };
  handleChange = (page, pageSize) => {
    this.setState({ currPageNum: page, pageSize });
  };
  handleShowSizeChange = (current, size) => {
    this.setState({ currPageNum: current, pageSize: size });
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
  handleShowSubCategorys = (category) => {
    return () => {
      const { _id, name } = category;
      this.setState(
        {
          parentId: _id,
          parentName: name,
        },
        () => {
          this.getCategorys();
        }
      );
    };
  };
  handleShowCategory = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    }, () => {
      this.getCategorys()
    });
  };
  handelAddCategory = async () => {
    this.addCategoryFrom.current.formRef.current.validateFields().then(async (values) => {
      this.setState({
        showStatus: 0,
      });
      const { parentId } = this.state;
      const { parentId: newParentId, categoryName } = values;
      const res = await reqAddCategory(categoryName, newParentId);
      if (res.status === 0) {
        if (newParentId === parentId) {
          //重新获取当前分类列表
          this.getCategorys();
        }
      } else {
        message.error('添加分类失败，请稍后再试')
      }
    }).catch(error => {
      message.warning('您未输入分类名称或输入的分类名称不合法，请重新输入');
    })
  };
  handleUpdateCategory = () => {
    this.upCategory.current.formRef.current.validateFields().then(async (values) => {
      this.setState({
        showStatus: 0,
      });
      const { categoryName } = values;
      const { categoryId } = this.state;
      const res = await reqUpdateCategory({ categoryName, categoryId });
      if (res.status === 0) {
        this.getCategorys();
      } else {
        message.error("更新分类失败，请稍后再试");
      }
    }).catch((error) => {
      message.warning('您未输入分类名称或输入的分类名称不合法，请重新输入');
    });
  };
  handleHideModal = () => {
    this.setState({
      showStatus: 0,
    });
  };
  handleShowAddModal = () => {
    this.setState({
      showStatus: 1,
    });
  };
  handleShowUpdateModal = (category) => {
    this.setState({
      showStatus: 2,
      categoryName: category.name,
      categoryId: category._id,
    });
  };
  render() {
    const {
      categorys,
      currPageNum,
      total,
      pageSize,
      loading,
      subCategorys,
      parentId,
      parentName,
      showStatus,
      categoryName,
    } = this.state;
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.handleShowCategory}>
            一级分类列表
          </LinkButton>
          <ArrowRightOutlined style={{ marginRight: "5px" }} />
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <Button
        type="primary"
        onClick={this.handleShowAddModal}
        icon={<PlusOutlined />}
      >
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          rowKey="_id"
          bordered
          loading={loading}
          pagination={{
            onChange: this.handleChange,
            onShowSizeChange: this.handleShowSizeChange,
            hideOnSinglePage: true,
            defaultPageSize: 5,
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
          scroll={{ scrollToFirstRowOnChange: true, y: "570px" }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          maskClosable={false}
          onOk={this.handelAddCategory}
          onCancel={this.handleHideModal}
          okText="确认"
          cancelText="取消"
        >
          <AddForm
            ref={this.addCategoryFrom}
            categorys={categorys}
            parentId={parentId}
          />
        </Modal>
        <Modal
          title="更改分类"
          visible={showStatus === 2}
          maskClosable={false}
          onOk={this.handleUpdateCategory}
          onCancel={this.handleHideModal}
          okText="确认"
          cancelText="取消"
        >
          <UpdateForm
            ref={this.upCategory}
            categoryName={categoryName}
          />
        </Modal>
      </Card>
    );
  }
}
