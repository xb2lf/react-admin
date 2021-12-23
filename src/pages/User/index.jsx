import React, { Component } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { LinkButton } from '../../components'
import { PAGE_SIZE } from "../../utils/constants";
import { formatDate } from '../../utils/dateUtils';
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api';
import { AddForm } from './components';

const { confirm } = Modal;
export default class User extends Component {
  state = {
    users: [],//所有用户列表
    roles: [], //所有角色列表
    user: {},//选中的user
    total: 0,
    pageSize: 5,
    loading: false,
    currPageNum: 1,
    isShow: false,
    isUpdate: false,
    updateUserId: '',
    roleNames: {},
  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers();
  }
  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: 'create_time',
        render: formatDate

      },
      {
        title: "所属角色",
        dataIndex: 'role_id',
        render: (role_id) => this.state.roleNames[role_id]
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.handleUpdateUser(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.handleshowDelete(user)}>删除</LinkButton>
          </span>
        ),

      },
    ];
  };
  //生成角色名和角色Id一一对应的对象
  iniRoleNames = (roles) => {
    // first method
    /*  const roleNames = {};
     roles.forEach(role => roleNames[role._id] = role.name); */

    //second method
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre;
    }, {});
    return roleNames
  }
  getUsers = async () => {
    this.setState({ loading: true });
    const res = await reqUsers();
    this.setState({ loading: false });
    if (res.status === 0) {
      const { users, roles } = res.data;
      const roleNames = this.iniRoleNames(roles);
      this.setState({ users, roles, roleNames });
    } else {
      message.warning('获取用户列表失败，请稍后再试')
    }
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
    this.setState({ user: {}, isUpdate: false, isShow: true });
  }
  handelAddUser = async () => {
    this.form.current.validateFields().then(async (values) => {
      this.setState({ isShow: false });
      const user = values;
      const { isUpdate, updateUserId } = this.state;
      const msgText = isUpdate ? '修改' : '创建';
      if (isUpdate) {
        user._id = updateUserId;
      }
      const res = await reqAddOrUpdateUser(user);
      if (res.status === 0) {
        message.success(`${msgText}用户成功`);
        this.getUsers();
      } else {
        message.error(`${msgText}用户失败，请稍后再试！`)
      }
    }).catch(error => {
      message.warning('您还有未填入的必须项或必须项不合法');
    })
  };
  handleHideModal = () => {
    this.setState({ isShow: false, });
  };
  handleUpdateUser = (user) => {
    this.setState({ updateUserId: user._id, isUpdate: true, isShow: true, user: { ...user } });
  }
  handleshowDelete = (user) => {
    confirm({
      title: `您确定要删除${user.username}吗`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: false,
      onOk: () => {
        this.handleDeleteUser(user._id);
      },
      /* onCancel: () => {
        console.log('Cancel');
      }, */
    });
  }
  handleDeleteUser = async (userId) => {
    const res = await reqDeleteUser(userId);
    if (res.status === 0) {
      message.success('删除用户成功');
      this.getUsers();
    } else {
      message.error('删除用户失败')
    }
  }
  render() {
    const {
      users,
      user,
      roles,
      loading,
      total,
      pageSize,
      currPageNum,
      isShow,
      isUpdate,
    } = this.state;
    const title = (
      <span>
        <Button type="primary" className="user-title-left" onClick={this.handleShowAdd}>
          创建用户
        </Button>
      </span>
    );
    return (
      <Card title={title} className="user-home">
        <Table
          dataSource={users}
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
        <Modal
          title={isUpdate ? '创建用户' : '修改用户'}
          visible={isShow}
          maskClosable={false}
          onOk={this.handelAddUser}
          onCancel={this.handleHideModal}
          okText="确认"
          cancelText="取消"
        >
          <AddForm
            roles={roles}
            user={user}
            setForm={form => this.form = form}
          />
        </Modal>
      </Card>
    );
  }
}

