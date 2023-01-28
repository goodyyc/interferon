// 迁移至geneHeatmap，需将gene替换为gene（标题大写，message提示大写），
// setText无需拼接，threshold调整为0.4

import Head from 'next/head';
import ReactECharts from 'echarts-for-react';
import Nav from '../components/nav.js';
import { useState, useEffect, useRef } from 'react';
import { message, Layout, Select, Input, AutoComplete } from 'antd';
import heatmap from '../data/geneHeatmap.json';
import axis from '../data/geneAxis.json';
import * as echarts from 'echarts';
import tree from '../data/tree.json';

const { Header, Footer, Sider, Content } = Layout;

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function GeneHeatmap({ autocompleteOptions }) {
  const textXRef = useRef();
  const textYRef = useRef();
  const thresholdRef = useRef();
  const [selectedX, setSelectedX] = useState('HACD4/FOCAD');
  const [selectedY, setSelectedY] = useState('HACD4/FOCAD');
  const [textX, setTextX] = useState('');
  const [textY, setTextY] = useState('');
  const [speciesX, setSpeciesX] = useState('');
  const [speciesY, setSpeciesY] = useState('');
  const [threshold, setThreshold] = useState(0.5);
  useEffect(() => {
    function getSpecies(root, list, chk) {
      let result = [];
      for (let x of list) {
        if (chk || root.name.includes(x)) {
          chk = true;
          break;
        }
      }
      if (root.hasOwnProperty('children')) {
        for (let x of root.children) {
          result.push(...getSpecies(x, list, chk));
        }
      } else if (chk) {
        result.push(root.name);
      }
      return result;
    }
    console.log(textXRef,textXRef.current, textXRef.current !== null);
    textXRef.current.value=textX;
    textYRef.current.value=textY;
    let data = [];
    // set newAxis, newHeatmap from axis, heatmap
    let axisX = axis;
    let axisY = axis;
    for (let i = 0; i < axis.length; i++) {
      axisX[i].cnt = i;
      axisY[i].cnt = i;
    }
    if (textX != '') {
      axisX = axisX.filter(x => x.gene == textX);
      if (axisX == undefined) {
        message.error('No such gene');
        return;
      }
    } else if (selectedX != 'All') {
      let target = selectedX.split('/');
      axisX = axisX.filter(x => x.neighbors.some(y => target.includes(y)));
    }
    if (textY != '') {
      axisY = axisY.filter(x => x.gene == textX);
      if (axisY == undefined) {
        message.error('No such gene');
        return;
      }
    }
    if (selectedY != 'All') {
      let target = selectedY.split('/');
      axisY = axisY.filter(x => x.neighbors.some(y => target.includes(y)));
    }
    let tempListX = speciesX.split(/[,，]/);
    tempListX = tempListX.map(x => x.trim());
    let speciesListX = getSpecies(tree, tempListX, false);
    let tempListY = speciesY.split(/[,，]/);
    tempListY = tempListY.map(x => x.trim());
    let speciesListY = getSpecies(tree, tempListY, false);
    axisX = axisX.filter(x => speciesListX.includes(x.species));
    axisY = axisY.filter(x => speciesListY.includes(x.species));
    let lenX = axisX.length;
    let lenY = axisY.length;
    let newHeatmap = new Array(lenX);
    for (let i = 0; i < lenX; i++) {
      newHeatmap[i] = new Array(lenY);
    }
    for (let i = 0; i < lenX; i++) {
      for (let j = 0; j < lenY; j++) {
        newHeatmap[i][j] = heatmap[axisX[i].cnt][axisY[j].cnt];
      }
    }
    for (let i = 0; i < lenX; i++) {
      for (let j = 0; j < lenY; j++) {
        data.push([
          i,
          j,
          newHeatmap[i][j],
          axisX[i].species +
            '_' +
            axisX[i].gene +
            '_' +
            axisX[i].neighbors.join(','),
          axisY[j].species +
            '_' +
            axisY[j].gene +
            '_' +
            axisY[j].neighbors.join(','),
          axisX[i].id,
          axisY[j].id,
        ]);
      }
    }
    let showAxisX = axisX.map(d => d.species + '_' + d.gene);
    let showAxisY = axisY.map(d => d.species + '_' + d.gene);

    var option;

    option = {
      tooltip: {
        position: 'bottom',
        formatter: function (params) {
          return (
            params.data[3] + '<br>' + params.data[4] + '<br>' + params.data[2]
          );
        },
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: 'slider',
          xAxisIndex: [0],
          filterMode: 'filter',
        },
        {
          id: 'dataZoomY',
          type: 'slider',
          yAxisIndex: [0],
          filterMode: 'filter',
        },
      ],
      grid: {
        top: 20,
        left: 300,
        right: 50,
        //- height: height-300
      },
      xAxis: {
        data: showAxisX,
      },
      yAxis: {
        data: showAxisY,
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'left',
        dimension: 2,
        precision: 2,
        inRange: {
          color: ['#FFFFFF', '#E74C3C'],
        },
      },
      series: {
        type: 'heatmap',
        data: data,
        progressive: 30000,
      },
    };
    let chartDom = document.getElementById('echart');
    let myChart = echarts.init(chartDom);
    myChart.setOption(option);
    myChart.on('click', e =>
      window.open('proteinAlign/' + [e.data[5], e.data[6]].join('/'), '_blank')
    );
    // echartRef.current.getEchartsInstance().setOption(option);
  }, [speciesX, speciesY, textX, textY, selectedX, selectedY]);
  return (
    <Layout>
      <Head>
        <title>Heatmap</title>
      </Head>
      <Header>
        <Nav selected='Heatmap' />
      </Header>
      <Content>
        <Input.Group
          compact
          style={{ marginTop: 10, justifyContent: 'center', display: 'flex' }}
        >
          <Select
            defaultValue='HACD4/FOCAD'
            style={{ width: 200 }}
            size='large'
            onChange={e => {
              setSelectedX(e);
            }}
          >
            <Select.Option value='All'>All</Select.Option>
            <Select.Option value='HACD4/FOCAD'>HACD4/FOCAD</Select.Option>
            <Select.Option value='UBAP2/UBE2R2'>UBAP2/UBE2R2</Select.Option>
            <Select.Option value='MTAP'>MTAP</Select.Option>
            <Select.Option value='MOB3B'>MOB3B</Select.Option>
          </Select>
          <Input.Search
            placeholder='Gene'
            ref={textXRef}
            size='large'
            allowClear={true}
            onSearch={e => setTextX(e)}
            style={{ width: 200 }}
          />

          <AutoComplete
            options={autocompleteOptions}
            onSelect={e => setSpeciesX(e)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            <Input.Search
              placeholder='Species'
              size='large'
              onSearch={e => setSpeciesX(e)}
              style={{ width: 200 }}
            />
          </AutoComplete>
        </Input.Group>
        <Input.Group
          compact
          style={{ marginTop: 10, justifyContent: 'center', display: 'flex' }}
        >
          <Select
            defaultValue='HACD4/FOCAD'
            style={{ width: 200 }}
            size='large'
            onChange={e => {
              setSelectedY(e);
            }}
          >
            <Select.Option value='All'>All</Select.Option>
            <Select.Option value='HACD4/FOCAD'>HACD4/FOCAD</Select.Option>
            <Select.Option value='UBAP2/UBE2R2'>UBAP2/UBE2R2</Select.Option>
            <Select.Option value='MTAP'>MTAP</Select.Option>
            <Select.Option value='MOB3B'>MOB3B</Select.Option>
          </Select>
          <Input.Search
            placeholder='Gene'
            ref={textYRef}
            size='large'
            allowClear={true}
            onSearch={e => setTextY(e)}
            style={{ width: 200 }}
          />
          <AutoComplete
            options={autocompleteOptions}
            onSelect={e => setSpeciesY(e)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            <Input.Search
              placeholder='Species'
              size='large'
              allowClear={true}
              onSearch={e => setSpeciesY(e)}
              style={{ width: 200 }}
            />
          </AutoComplete>
        </Input.Group>
        <div id='echart' style={{ height: '90vh', width: '100%' }}></div>
        {/* <ReactECharts
          ref={echartRef}
          option={{}}
          style={{ height: '90vh', width: '100%' }}
          onEvents={{
            click: e =>
              setText(e.name.split('_')[2] + '_' + e.name.split('_')[3]),
          }}
        /> */}
      </Content>
    </Layout>
  );
}

export async function getStaticProps() {
  function getAllOptions(root) {
    let result = [];
    if (root.hasOwnProperty('children')) {
      for (let x of root.children) {
        result.push(...getAllOptions(x));
      }
    }
    result.push({ value: root.name });
    return result;
  }
  let autocompleteOptions = getAllOptions(tree);
  return {
    props: {
      autocompleteOptions: autocompleteOptions,
    },
  };
}
