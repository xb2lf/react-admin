import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { reqWeather } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import { formatDate } from '../../utils/dateUtils';
import { menuList } from '../../config/menuConfig';
import { removeUser } from '../../utils/storageUtils';
import LinkButton from '../LinkButton'
import './index.less'

const { confirm } = Modal;
class Header extends Component {
  state = {
    currentTime: formatDate(Date.now()),
    dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png',
    weather: '晴',
    title: '',
  }
  componentDidMount() {
    this.getTime();
    this.getWeather();
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  getTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        currentTime: formatDate(Date.now())
      })
    }, 1000);
  }
  getWeather = async () => {
    const weather = await reqWeather('110000');
    this.setState({ weather });
  }
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path);
        if (cItem) {
          title = cItem.title;
        }
      }
    })
    return title
  }
  handleLogout = () => {
    confirm({
      icon: <QuestionCircleOutlined />,
      content: '确定要退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        removeUser();
        memoryUtils.user = {};
        this.props.history.replace('/login');
      },
    });
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;
    const { username } = memoryUtils.user;
    const title = this.getTitle();
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.handleLogout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
