import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { logout } from '../../redux/actions'
import { reqWeather } from '../../api';
import { formatDate } from '../../utils/dateUtils';
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
  handleLogout = () => {
    confirm({
      icon: <QuestionCircleOutlined />,
      content: '确定要退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.logout()
      },
    });
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;
    const { username } = this.props.user;
    const title = this.props.headTitle;
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

const mapStateToProps = state => ({ headTitle: state.headTitle, user: state.user })

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps)(withRouter(Header))
