import React, { PureComponent } from 'react'
import { Tree, Form, Input } from "antd";
import PropTypes from 'prop-types'
import { menuList } from '../../../../config/menuConfig'
const Item = Form.Item;

export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object.isRequired,
  }
  state = {
    treeData: [{ title: '平台权限', key: 'all', children: [] }],
    checkedKeys: [],
  }
  UNSAFE_componentWillMount() {
    const { role } = this.props;
    this.setState(state => {
      const parent = { ...state.treeData[0] };
      parent.children = [...menuList];
      return { treeData: [parent], checkedKeys: [...role.menus] }
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.role._id !== this.props.role._id) {
      const { role } = nextProps;
      this.setState({ checkedKeys: [...role.menus] })
    }
  }
  getMenus = () => this.state.checkedKeys

  onCheck = (checkedKeys, info) => {
    this.setState({ checkedKeys })
  };
  render() {
    const { treeData, checkedKeys } = this.state
    const { role } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <Item
          label="角色名称"
          {...formItemLayout}
        >
          <Input value={role.name} disabled />
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            treeData={treeData}
          />
        </Item>
      </div>
    );
  }
}
