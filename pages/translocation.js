import Head from 'next/head'
import tree from '../data/tree.json'
import Nav from '../components/nav.js'
import { useState, useEffect, useRef } from 'react'
import { Layout, Input, Select, AutoComplete, Switch } from 'antd'
import * as echarts from 'echarts'
import translocation from '../data/translocation2.json'
import { main } from '@popperjs/core'

const { Header, Footer, Sider, Content } = Layout
const { Option } = Select

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function Chromosome ({ autocompleteOptions }) {
  const [selected, setSelected] = useState('4')
  let selection = []
  for (let i = 0; i < translocation.length; i++) {
    selection.push(
      translocation[i].data[0].value + '-' + translocation[i].data[0].name
    )
  }
  useEffect(() => {
    let categories = [
      {
        name: 'main',
      },
      { name: 'similar gene' },
      { name: 'initial neighbors' },
      { name: 'common neighbors' },
      { name: 'final neighbor' },
    ]
    let option = {
      // title: {
      //   text: 'Basic Graph',
      // },
      tooltip: {
        formatter: params => {
          return params.data.value
        },
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      legend: [
        {
          data: categories.map(function (a) {
            return a.name
          }),
        },
      ],

      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            // edgeLength: 45,
            // layoutAnimation: false,
          },
          zoom: 3,
          draggable: true,
          symbolSize: 15,
          roam: true,
          label: {
            show: true,
          },
          // edgeSymbol: ['circle', 'arrow'],
          // edgeSymbolSize: [4, 10],
          // edgeLabel: {
          //   show: true,
          //   formatter: '{c}',
          //   fontSize: 20,
          // },
          data: translocation[selected].data,
          // links: [],
          links: translocation[selected].links,
          categories: categories,
          lineStyle: {
            color: 'source',
            curveness: 0.3,
          },
        },
      ],
    }
    let chartDom = document.getElementById('echarts')
    let myChart = echarts.init(chartDom)
    myChart.setOption(option)
    // write to clipboard);
  }, [selected])
  return (
    <Layout>
      <Head>
        <title>Chromosome</title>
      </Head>
      <Header>
        <Nav selected='Translocation' />
      </Header>
      <Content style={{ padding: 10 }}>
        <Input.Group
          compact
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <Select
            style={{ width: '30%' }}
            defaultValue={4}
            size='large'
            onChange={value => setSelected(value)}
          >
            {selection.map(function (value, index) {
              return (
                <Select.Option key={index} value={index}>
                  {value}
                </Select.Option>
              )
            })}
          </Select>
        </Input.Group>

        <div
          id='echarts'
          style={{ marginTop: '100px', width: '80%', height: '600px' }}
        ></div>
      </Content>
    </Layout>
  )
}
