import React, { Component, createRef } from 'react';
import { Card, Button } from 'antd'
import ReactECharts from 'echarts-for-react';
export default class Bar extends Component {
  barEchart = createRef(null)
  state = {
    sales: [5, 20, 36, 10, 10, 20], //销量
    stores: [6, 10, 25, 20, 15, 10],//库存
  }
  componentDidMount() {
    this.barEchart.current.resize();
  }
  getOption = (sales, stores) => {
    return {
      color: ['#A90000', '#5470C6'],
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {
        type: 'value',
        min: 0,
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: sales
        },
        {
          name: '库存',
          type: 'bar',
          data: stores
        },
      ]
    }
  }
  handleUpdate = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store - 1)
        return pre;
      }, [])
    }))
  }
  render() {
    const { sales, stores } = this.state;
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.handleUpdate}>更新</Button>
        </Card>
        <Card title="柱状图一">
          <ReactECharts ref={this.barEchart} isInitialResize option={this.getOption(sales, stores)} />
        </Card>
      </div>
    )
  }
}
