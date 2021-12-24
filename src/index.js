import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import App from './App';
import store from './redux/store';
/* import 'antd/dist/antd.css'; */


ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);