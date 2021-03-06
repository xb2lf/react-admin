import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Login, Admin } from './pages'
import './assets/css/common.less'
export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </HashRouter>
    )
  }
}


