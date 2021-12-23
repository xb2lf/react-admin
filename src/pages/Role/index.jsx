import React, { Component, createRef } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { LinkButton } from '../../components'
import { PAGE_SIZE } from "../../utils/constants";
import { formatDate } from '../../utils/dateUtils';
import { reqRoles, reqAddrole, reqUpdaterole } from '../../api';
import { AddForm, AuthForm } from './components';
import memoryUtils from '../../utils/memoryUtils';
import { removeUser } from '../../utils/storageUtils'
import "./index.less";

export default class Role extends Component {
  auth = createRef(null)
  state = {
    roles: [],//所有角色列表
    role: {},//选中的role
    total: 0,
    pageSize: 5,
    loading: false,
    currPageNum: 1,
    name: '',
    isShowAdd: false,
    isShowAuth: false,
  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getRoles();
  }
  initColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formatDate(create_time)
      },
      {
        title: "授权时间",
        dataIndex: 'auth_time',
        render: formatDate

      },
      {
        title: "授权人",
        dataIndex: 'auth_name'

      },
    ];
  };
  getRoles = async () => {
    this.setState({ loading: true });
    const res = await reqRoles();
    this.setState({ loading: false });
    if (res.status === 0) {
      this.setState({ roles: res.data });
    } else {
      message.warning('获取角色列表失败，请稍后再试')
    }
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({ role })
      }, // 点击行
    };
  }
  addRoleName = (name) => {
    this.setState({ name })
  }
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
  handleShowAdd = () => {
    this.setState({ isShowAdd: true });
  }
  handelAddRole = async () => {
    const { name } = this.state;
    if (!name) {
      message.warning('您还没有输入角色名称！')
      return;
    }
    this.setState({ isShowAdd: false });
    const res = await reqAddrole(name);
    if (res.status === 0) {
      message.success('添加角色成功');
      const role = res.data;
      this.setState(state => ({ roles: [...state.roles, role] }))
    } else {
      message.error('添加角色失败，请稍后再试！')
    }

  };
  handleHideModal = () => {
    this.setState({ isShowAdd: false, });
  };
  handleShowUpdate = () => {
    this.setState({ isShowAuth: true })
  }
  handeludateRole = async () => {
    const { role } = this.state;
    const menus = this.auth.current.getMenus();
    if (menus.length === 0) {
      message.warning('请选择对应权限目录');
      return;
    }
    this.setState({ isShowAuth: false });
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now()
    const res = await reqUpdaterole(role);
    if (res.status === 0) {
      //如果当前更新的是自己的权限，强制退出
      if (role._id === memoryUtils.user.role._id) {
        memoryUtils.user = {};
        removeUser();
        this.props.history.replace('/login');
        message.info('当前用户角色权限已更新，重新登录');
      } else {
        message.success('设置角色权限成功');
        /* this.getRoles(); */
        this.setState({
          roles: [...this.state.roles]
        })
      }
    } else {
      message.error('设置角色权限失败')
    }
  }
  handleHideAuth = () => {
    this.setState({ isShowAuth: false })
  }
  render() {
    const {
      roles,
      role,
      loading,
      total,
      pageSize,
      currPageNum,
      isShowAdd,
      isShowAuth
    } = this.state;
    const title = (
      <span>
        <Button type="primary" className="role-title-left" onClick={this.handleShowAdd}>
          创建角色
        </Button>
        <Button type="primary" disabled={!role._id} onClick={this.handleShowUpdate}>设置权限角色</Button>
      </span>
    );
    return (
      <Card title={title} className="role-home">
        <Table
          dataSource={roles}
          columns={this.columns}
          rowKey="_id"
          bordered
          loading={loading}
          rowSelection={{
            type: 'radio',
            fixed: true,
            selectedRowKeys: [role._id],
          }}
          onRow={this.onRow}
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
        <Modal
          title="创建角色"
          visible={isShowAdd}
          maskClosable={false}
          onOk={this.handelAddRole}
          onCancel={this.handleHideModal}
          okText="确认"
          cancelText="取消"
        >
          <AddForm
            addRoleName={this.addRoleName}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          maskClosable={false}
          onOk={this.handeludateRole}
          onCancel={this.handleHideAuth}
          okText="确认"
          cancelText="取消"
        >
          <AuthForm
            role={role}
            ref={this.auth}
          />
        </Modal>
      </Card>
    );
  }
}
