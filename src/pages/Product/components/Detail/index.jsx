import React, { Component } from "react";
import { Card, List, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { LinkButton } from "../../../../components";
import { BASE_IMG_URL } from "../../../../utils/constants";
import { reqCategory } from "../../../../api";
import "./index.less";

const Item = List.Item;

export default class ProductDetail extends Component {
  state = {
    parentName: "",
    childName: "",
  };
  componentDidMount() {
    this.getCategory();
  }
  getCategory = async () => {
    const { pCategoryId, categoryId } = this.props.location.state.product;
    if (pCategoryId === "0") {
      const res = await reqCategory(categoryId);
      if (res.status === 0) {
        const { name } = res.data;
        this.setState({ parentName: name });
      } else {
        message.warning("获取分类名称失败，请稍后再试");
      }
    } else {
      Promise.all(
        [reqCategory(pCategoryId),
        reqCategory(categoryId)]
      ).then((res) => {
        const parentName = res[0].data.name;
        const childName = res[1].data.name;
        this.setState({ parentName, childName });
      }).catch(err => {
        message.warning("获取分类名称失败，请稍后再试");
      });
    }
  };
  handleJumpHome = () => {
    this.props.history.goBack();
  };
  render() {
    const { name, desc, price, imgs, detail } =
      this.props.location.state.product;
    const { parentName, childName } = this.state;
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            className="back-arrow"
            onClick={this.handleJumpHome}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="detial-item-left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="detial-item-left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="detial-item-left">商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="detial-item-left">所属分类:</span>
            <span>
              {parentName}
              {childName ? " --> " + childName : ""}
            </span>
          </Item>
          <Item>
            <span className="detial-item-left">商品图片:</span>
            <span>
              {imgs.map((img) => (
                <img
                  key={img}
                  src={BASE_IMG_URL + img}
                  alt="商品图片"
                  className="product-img"
                />
              ))}
            </span>
          </Item>
          <Item>
            <span className="detial-item-left">商品详情:</span>
            <span
              dangerouslySetInnerHTML={{
                __html: detail,
              }}
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}
