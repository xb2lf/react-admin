import React, { Component } from "react";
import { Card, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { LinkButton } from "../../components";
import "./index.less";
export default class Category extends Component {
  handleCHange = () => { };
  render() {
    const title = "一级分类列表";
    const extra = (
      <Button type="primary" icon={<PlusOutlined />}>
        添加
      </Button>
    );
    const dataSource = [
      {
        parentId: "0",
        _id: "5e12b8bce31bb727e4b0e348",
        name: "家用电器",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e130e60e31bb727e4b0e34b",
        name: "手机",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e130ec7e31bb727e4b0e34c",
        name: "洗衣机",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e1346533ed02518b4db0cd7",
        name: "图书",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e13467e3ed02518b4db0cd8",
        name: "杯具",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e1346c83ed02518b4db0cd9",
        name: "纸",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e144dc7297c1138787e96ab",
        name: "服装",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5e144de1297c1138787e96ac",
        name: "玩具",
        __v: 0,
      },
    ];

    const columns = [
      {
        title: "分类",
        dataIndex: "name",
      },
      {
        title: "操作",
        width: 300,
        render: () => (
          <span>
            <LinkButton>修改分类</LinkButton>
            <LinkButton>查看子分类</LinkButton>
          </span>
        ),
      },
    ];
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey='_id'
          bordered
          pagination={{
            onChange: this.handleCHange,
            hideOnSinglePage: true,
          }}
        />
      </Card>
    );
  }
}
