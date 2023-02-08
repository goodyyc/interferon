import Head from 'next/head'
import tree from '../data/tree.json'
import Nav from '../components/nav.js'
import { useState, useEffect, useRef } from 'react'
import { Layout, Input, Select, AutoComplete, Switch } from 'antd'
import * as echarts from 'echarts'
const { Header, Footer, Sider, Content } = Layout
const { Option } = Select
import data from '../data/mydata/blast_result.json'
import species from '../data/mydata/species.json'
export default function Newseq () {
  const echartRef = useRef()
  const [height, setHeight] = useState(0)
  const [selectedItems, setSelectedItems] = useState('Anas platyrhynchos_绿头鸭')
  const [labelShow, setLabelShow] = useState(true)
  useEffect(() => {
    document.getElementById('echarts').innerHTML = ''
    let color = ['#bd6d6c', '#000000', '#75d874', '#75d874']
    function renderItem (params, api) {
      //- 0:index, 1:start, 2:end, 3:exon, 4:type, 5:name, 6:product
      let mid = api.coord([(api.value(1) + api.value(2)) / 2, 0])
      let width = api.size([api.value(2) - api.value(1), 0])[0]
      let height = api.size([0, 1])[1]
      if (api.value(4) === 3 || api.value(4) === 0) {
        height /= 2
      }
      let shape = {
        x: mid[0] - width / 2,
        y: mid[1] - height,
        width: width,
        height: height,
      }
      let result = {
        type: 'rect',
        shape: shape,
        style: api.style({
          fill: color[api.value(4)],
        }),
      }
      return result
    }
    let groupDatas = []
    const chosen_species = selectedItems.split("_")[0]
    const index = data.findIndex(item => { return item.species === chosen_species })
    if (index === -1) {
      for (let q = 0; q < data.length; q++) {
        const species_name = data[q].full_name
        for (let qq = 0; qq < data[q].chr_node.length; qq++) {
          //chromosome_name=data[q].chr_node[qq].chromosome
          const temp = data[q].chr_node[qq].chr === '' ? 'Unknown' : data[q].chr_node[qq].chr
          const new_data_node = {
            species: species_name,
            chromosome: data[q].chr_node[qq].chromosome + ' ' + temp,
            start: 1,
            end: data[q].chr_node[qq].length,
            data: data[q].chr_node[qq].children,
            // full_name: full_name
          }
          groupDatas.push(new_data_node)
        }
      }
    }
    else {
      const nowdata = data[index]
      for (let q = 0; q < nowdata.chr_node.length; q++) {
        const temp = nowdata.chr_node[q].chr === '' ? 'Unknown' : nowdata.chr_node[q].chr
        const new_data_node = {
          species: nowdata.full_name,
          chromosome: nowdata.chr_node[q].chromosome + ' ' + temp,
          start: 1,
          end: nowdata.chr_node[q].length,
          data: nowdata.chr_node[q].children,
          //full_name: nowdata.full_name
        }
        groupDatas.push(new_data_node)
      }
    }

    // groupDatas = species.filter(() => { }
    // )
    setHeight(groupDatas.length * 100 + 100)
    let gridIndex = 0
    for (let ii = 0; ii < groupDatas.length; ii++) {
      let maxExon = 1
      let chromosome = groupDatas[ii]
      let datas = []
      for (let i = 0; i < chromosome['data'].length; i++) {
        let c = chromosome['data'][i]
        let color = 'red'
        let label = {}
        //比对到的序列
        if (c.type === 'seq') {
          color = 'black'
          datas.push({
            value: [
              0,
              c.seq_start,//c.start,
              c.seq_end,//c.end,
              0,//c.exon序列没有外显子
              1,//c.type,#序列的type设置为1
              c.show_name,//c.gene,
              '',//c.product,
              c.seq_length,//7
              c.identity,//8
              c.positive,//9
              c.gap,//10
              c.name,
              //c.exactStart.toLocaleString(),
              //c.exactEnd.toLocaleString(),
            ],
            label: {
              formatter: function (params) {
                return params.value[5]
              },
              show: labelShow,
              position: 'top',
              padding: 10,
              borderColor: '#0000',
              borderWidth: 2,
              color: 'purple',
            },
            labelLine: {
              show: labelShow,
              smooth: 1,
            },
          })
        }
        //基因
        // else (c.type === 'gene')
        // {
        //   // 干扰素相关基因
        //   if (c.inner_type === '3') {
        //     datas.push({
        //       value: [
        //         0,
        //         c.start,
        //         c.end,
        //         c.exon,
        //         c.inner_type,//c.type,
        //         c.name,//c.gene,
        //         c.product,
        //         c.direction,
        //         //c.exactStart.toLocaleString(),
        //         //c.exactEnd.toLocaleString(),
        //       ],
        //       label: {
        //         formatter: function (params) {
        //           return params.value[5]
        //         },
        //         show: labelShow,
        //         position: 'top',
        //         padding: 10,
        //         borderColor: '#0000',
        //         borderWidth: 2,
        //       },
        //       labelLine: {
        //         show: labelShow,
        //         smooth: true,
        //       },
        //     })
        //   }
        //   //I型干扰素基因
        //   else {
        //     datas.push({
        //       value: [
        //         0,
        //         c.start,
        //         c.end,
        //         c.exon,
        //         c.inner_type,//c.type,
        //         c.name,//c.gene,
        //         c.product,
        //         c.direction,
        //         //c.exactStart.toLocaleString(),
        //         //c.exactEnd.toLocaleString(),
        //       ],
        //     })
        //   }
        // }
        else {
          datas.push({
            value: [
              0,
              c.start,
              c.end,
              c.exon,
              c.inner_type,//c.type,
              c.name,//c.gene,
              c.product,
              c.direction,
              //c.exactStart.toLocaleString(),
              //c.exactEnd.toLocaleString(),
            ],
          })
        }
      }
      let tempBottom = 50
      if (!labelShow)
        tempBottom = 20
      let option = {
        tooltip: {
          formatter: params => {
            if (params.value[4] !== 1)
              return (
                params.value[5] +
                '<br> number of exon: ' +
                params.value[3] +
                '<br>product: ' +
                params.value[6] +
                '<br>start: ' +
                params.value[1] +
                '<br>end: ' +
                params.value[2]
                // '<br>direction: ' +
                // params.value[7]
              )
            else {
              return (
                params.value[11] +
                '<br>start: ' +
                params.value[1] +
                '<br>end: ' +
                params.value[2] +
                '<br>length: ' +
                params.value[7] +
                '<br>identity: ' +
                params.value[8] +
                '<br>positive: ' +
                params.value[9] +
                '<br>gap: ' +
                params.value[10]
              )
            }
          },
        },
        grid: {
          top: 30,
          bottom: tempBottom,
          left: '3%',
          right: 0,
          containLabel: true,
        },
        legend: {},
        xAxis: {
          max: chromosome['end'],
          splitNumber: 3,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          name:
            // chromosome['full_name'].split('_')[0] +
            // '\n\n' +
            chromosome['species'].split('_')[1] +
            '\n' +
            'chr ' + chromosome['chromosome'].split(' ')[1],
          triggerEvent: true,
          nameGap: 5,
          axisLabel: {
            show: false,
          },
          //- min: -maxExon,
          max: maxExon,
          interval: 1,
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            encode: {
              x: [1, 2],
              itemName: 5,
            },
            data: datas,
            labelLayout: {
              y: 77,
              align: 'left',
              moveOverlap: 'shiftX',
              draggable: true,
            },
          },
        ],
      }
      let el = document.createElement('div')
      el.setAttribute('id', 'main' + ii)
      let tempHeight = '100px'
      if (!labelShow) tempHeight = '70px'
      el.setAttribute(
        'style',
        'width: 95%; height: ' + tempHeight + '; margin:auto;'
      )
      document.getElementById('echarts').appendChild(el)
      let chartDom = document.getElementById('main' + ii)
      let myChart = echarts.init(chartDom, null, { renderer: 'canvas' })
      myChart.setOption(option)
      // write to clipboard
    }
  }, [labelShow, selectedItems])
  return (
    <Layout>
      <Head>
        <title>Newseq</title>
      </Head>
      <Header>
        <Nav selected='Newseq' />
      </Header>
      <Content style={{ padding: 10 }}>
        <Input.Group
          compact
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <AutoComplete
            options={species}
            style={{ width: '30%' }}
            onSelect={e => setSelectedItems(e)}
          >
            <Input.Search
              size='large'
              placeholder='input here'
              enterButton
              onSearch={e => setSelectedItems(e)}
              allowClear={true}
            />
          </AutoComplete>
        </Input.Group>
        <Switch
          style={{ margin: '10px auto 0 auto', display: 'flex' }}
          checkedChildren='Label Visible'
          unCheckedChildren='Label Hidden'
          defaultChecked
          onChange={e => setLabelShow(e)}
        />
        <div
          id='echarts'
          style={{ marginTop: '100px', width: '80%', height: '600px' }}
        >
        </div>
      </Content>
    </Layout>
  )
}