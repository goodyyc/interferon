import Head from 'next/head';
import tree from './data/tree.json';
import ReactECharts from 'echarts-for-react';
import Nav from './components/nav.js';
import { useState, useEffect, useRef } from 'react';
import { Layout, Input, Select } from 'antd';
import chResults from './data/chResults.json';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function Chromosome() {
  const echartRef = useRef();
  const [height, setHeight] = useState(0);
  const [selected, setSelected] = useState('NC');
  const [speciesText, setSpeciesText] = useState('');
  function update() {}
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
    let tempList = speciesText.split(/[,，]/);
    tempList = tempList.map(x => x.trim());
    let speciesList = getSpecies(tree, tempList, false);

    let chk;
    if (selected == 'NC') {
      chk = true;
    } else {
      chk = false;
    }
    let color = ['#bd6d6c', '#7b9ce1', '#75d874', '#75d874'];
    function renderItem(params, api) {
      //- 0:index, 1:start, 2:end, 3:exon, 4:type, 5:name, 6:product
      let mid = api.coord([(api.value(1) + api.value(2)) / 2, 0]);
      let width = api.size([api.value(2) - api.value(1), 0])[0];
      let height = api.size([0, 1])[1];

      let shape = {
        x: mid[0] - width / 2,
        y: mid[1] - height,
        width: width,
        height: height,
      };
      let result = {
        type: 'rect',
        shape: shape,
        style: api.style({
          fill: color[api.value(4)],
        }),
      };
      return result;
    }
    let option = {
      tooltip: {
        formatter: params => {
          return (
            params.value[5] +
            '<br>number of exon: ' +
            params.value[3] +
            '<br>product: ' +
            params.value[6] +
            '<br>start: ' +
            params.value[7] +
            '<br>end: ' +
            params.value[8]
          );
        },
      },
      grid: [],
      xAxis: [],
      yAxis: [],
      series: [],
    };
    let groupDatas = chResults.filter(
      x =>
        !(
          (chk && x.chromosome.includes('NW')) ||
          !speciesList.includes(x.species)
        )
    );
    setHeight(groupDatas.length * 100 + 100);
    let gridIndex = 0;
    for (let ii = 0; ii < groupDatas.length; ii++) {
      let maxExon = 1;
      let chromosome = groupDatas[ii];
      // $('body').append(
      //   '<div class="echarts" id="main' +
      //     ii +
      //     '"style="width: 95%; height: 100px; margin:auto;"></div>'
      // );
      let datas = [];
      for (let i = 0; i < chromosome['data'].length; i++) {
        let c = chromosome['data'][i];
        let color = 'red';
        let label = {};
        if (c.type == '3') {
          color = 'blue';
          datas.push({
            value: [
              0,
              c.start,
              c.end,
              c.exon,
              c.type,
              c.gene,
              c.product,
              c.exactStart.toLocaleString(),
              c.exactEnd.toLocaleString(),
            ],
            label: {
              formatter: function (params) {
                return params.value[5];
              },
              show: true,
              position: 'left',
              padding: 5,
              borderColor: '#0000',
              borderWidth: 1,
            },
            labelLine: {
              show: true,
              smooth: true,
            },
          });
        } else
          datas.push({
            value: [
              0,
              c.start,
              c.end,
              c.exon,
              c.type,
              c.gene,
              c.product,
              c.exactStart.toLocaleString(),
              c.exactEnd.toLocaleString(),
            ],
          });
      }
      option.grid.push({
        top: gridIndex * 100 + 50,
        bottom: (groupDatas.length - gridIndex) * 100,
        left: '3%',
        right: 0,
        containLabel: true,
      });
      option.xAxis.push({
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
        gridIndex: gridIndex,
      });
      option.yAxis.push({
        name:
          chromosome['species'].split('_')[1] +
          '\n' +
          chromosome['chromosome'].split(' ')[1],
        nameGap: 5,
        axisLabel: {
          show: false,
        },
        //- min: -maxExon,
        max: maxExon,
        interval: 1,
        gridIndex: gridIndex,
      });
      option.series.push({
        type: 'custom',
        renderItem: renderItem,
        encode: {
          x: [1, 2],
          itemName: 5,
        },
        data: datas,
        labelLayout: {
          // dx: -30,
          rotate: 30,
          y: gridIndex * 100 + 30,
          align: 'left',
          // moveOverlap: 'shiftX',
        },
        xAxisIndex: gridIndex,
        yAxisIndex: gridIndex,
      });
      gridIndex++;
    }

    echartRef.current.getEchartsInstance().clear();
    echartRef.current.getEchartsInstance().setOption(option);
  }, [selected, speciesText]);
  return (
    <Layout>
      <Head>
        <title>Chromosome</title>
      </Head>
      <Header>
        <Nav selected='Chromosome' />
      </Header>
      <Content style={{ padding: 10 }}>
        <Input.Group
          compact
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <Select
            style={{ width: '15%' }}
            defaultValue='NC'
            size='large'
            onChange={value => setSelected(value)}
          >
            <Option value='NC'>only NC</Option>
            <Option value='both'>both NC and NW</Option>
          </Select>
          <Input.Search
            size='large'
            style={{ width: '30%' }}
            onSearch={e => setSpeciesText(e)}
          />
        </Input.Group>
        <ReactECharts
          ref={echartRef}
          option={{}}
          style={{ height: height, width: '100%' }}
        />
      </Content>
    </Layout>
  );
}
