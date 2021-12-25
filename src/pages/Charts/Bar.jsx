import React, { Component } from 'react';
import { Card, Button } from 'antd'
import { ECharts } from 'echarts';
import ReactECharts from 'echarts-for-react';
export default class Bar extends Component {
  getOption = () => {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
  }
  handleUpdate = () => { }
  render() {
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.handleUpdate}>更新</Button>
        </Card>
        <Card title="柱状图">
          <ReactECharts option={this.getOption()} />
        </Card>
      </div>
    )
  }
}
