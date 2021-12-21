import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ProductHome, ProductAddUpdate, ProductDetail } from './components'
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product" exact component={ProductHome} />
        <Route path="/product/addupdate" component={ProductAddUpdate} />
        <Route path="/product/detail" component={ProductDetail} />
        <Redirect to="/product" />
      </Switch>
    )
  }
}
