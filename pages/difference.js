import Head from 'next/head';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Nav from '../components/nav.js';
import { Cascader, Divider, Layout } from 'antd';
import * as echarts from 'echarts';
import cascaderOptions from '../data/cascaderOptions.json';

const { Header, Footer, Sider, Content } = Layout;

export default function Difference({ cascaderOptions }) {
  console.log(cascaderOptions);
  function update(value, selectedOption) {
    setFile(value.join('_'));
  }
  const echartRef = useRef();
  const [file, setFile] = useState('2_HACD4');
  const [height, setHeight] = useState(1000);
  useEffect(() => {
    (async () => {
      let json = (await import('../data/collections/' + file + '.json'))
        .default;
      let species = (await import('../data/sortedSpecies.json')).default;
      setHeight(50 * json['data'].length + 200);
      // myChart.resize();
      let mp = {};
      for (let i = 0; i < species.length; i++) {
        mp[species[i].join('_')] = i;
      }
      json['data'].sort((a, b) => mp[a['species']] - mp[b['species']]);

      function renderItem(params, api) {
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        let width = api.size([1, 0])[0] * 0.8;
        var height = api.size([0, 1])[1] * 0.4;
        let x0 = start[0] + 3;
        let x1 = start[0] + width + 3;
        let y0 = start[1] - height / 2;
        let y1 = start[1] + height / 2;
        let points = [];
        if (api.value(5) == '+')
          points = [
            [x0, y0 + height / 4],
            [x0, y1 - height / 4],
            [x1 - width / 2, y1 - height / 4],
            [x1 - width / 2, y1],
            [x1, (y0 + y1) / 2],
            [x1 - width / 2, y0],
            [x1 - width / 2, y0 + height / 4],
          ];
        else
          points = [
            [x0, (y0 + y1) / 2],
            [x0 + width / 2, y1],
            [x0 + width / 2, y1 - height / 4],
            [x1, y1 - height / 4],
            [x1, y0 + height / 4],
            [x0 + width / 2, y0 + height / 4],
            [x0 + width / 2, y0],
          ];
        var rectShape = echarts.graphic.clipPointsByRect(points, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        });
        return (
          rectShape && {
            type: 'polygon',
            transition: ['shape', 'style', 'extra'],
            shape: { points: rectShape },
            style: api.style(),
            focus: 'series',
            emphasis: {
              style: api.styleEmphasis({
                lineWidth: 5,
                stroke: '#000a',
              }),
            },
            select: {
              style: api.styleEmphasis({
                lineWidth: 5,
                stroke: '#000a',
              }),
            },
            textContent: {
              transition: ['shape', 'style'],
              style: {
                text: api.value(2),
                fill: '#444d',
              },
              emphasis: {
                style: {
                  text: api.value(2),
                  fill: '#000f',
                },
              },
            },
            textConfig: { position: 'inside', rotation: -0.7 },
          }
        );
      }

      var option;

      var data = [];
      var yAxis = [];
      var color = ['#bd6d6c', '#7b9ce1', '#75d874', '#75d874'];
      let deeper = {
        '#bd6d6c': '#955',
        '#7b9ce1': '#68c',
        '#75d874': '#6b6',
      };
      let topGene = json['top'];
      let legend = [];
      let series = [];
      for (let i = 0; i < topGene.length; i++) {
        let name = topGene[i][0];
        legend.push(name);
        series.push({
          type: 'custom',
          name: name,
          renderItem: renderItem,
          encode: {
            x: [1, 8],
            y: 0,
          },
          //- animation: false,
          selectedMode: true,
          data: [],
        });
      }
      let maxLength = 0;
      json['data'].forEach(function (x, index) {
        maxLength = Math.max(maxLength, x['data'].length);
        let temp = x['species'].split('_');
        temp.push(x['chromosome']);
        temp.push(x['start'] + '~' + x['end']);
        yAxis.push(temp.join('\n'));
        for (let i = 0; i < x['data'].length; i++) {
          let y = x['data'][i];
          if (y['gene'] != '#') {
            let borderWidth = 0;
            if (!y['same']) borderWidth = 0;
            let gene = y['gene'];
            let j = 0;
            for (; j < topGene.length; j++) if (topGene[j][0] == gene) break;
            series[j]['data'].push({
              name: gene,
              value: [
                index,
                i,
                gene,
                y['exon'],
                y['product'],
                y['direction'],
                y['start'],
                y['end'],
                i + 1,
              ],
              itemStyle: {
                color: color[y['type']],
                borderType: 'solid',
                borderColor: '#fffb',
                borderWidth: borderWidth,
              },
            });
          }
        }
      });
      option = {
        tooltip: {
          formatter: function (params) {
            return (
              '<div contenteditable="true">' +
              params.marker +
              params.name +
              '<br> number of exon: ' +
              params.value[3] +
              '<br>product: ' +
              params.value[4] +
              '<br>start: ' +
              params.value[6] +
              '<br>end: ' +
              params.value[7] +
              '</div>'
            );
          },
          enterable: true,
          position: (point, params, dom, rect, size) => [
            rect.x + rect.width - 10,
            rect.y + rect.height - 10,
          ],
        },
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            labelFormatter: '',
            startValue: 0,
            endValue: 30,
            minValueSpan: 20,
            maxValueSpan: 500,
            realtime: false,
          },
        ],
        grid: {
          left: 200,
          right: 50,
        },
        legend: {
          type: 'scroll',
          show: true,
          data: legend,
          inactiveBorderColor: '#555',
          inactiveBorderWidth: 3,
        },
        xAxis: {
          scale: true,
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          data: yAxis,
          splitLine: {
            show: true,
          },
          inverse: true,
        },
        series: series,
      };
      const echart = echartRef.current.getEchartsInstance();
      echart.clear();
      echart.setOption(option);
      echart.on('legendselectchanged', params => {
        echart.dispatchAction({
          type: 'legendSelect',
          name: params['name'],
        });
        echart.dispatchAction({
          type: 'toggleSelect',
          seriesName: params['name'],
          dataIndex: 0,
        });
      });
    })();
  }, [file]);
  return (
    <Layout>
      <Head>
        <title>Difference</title>
      </Head>
      <Header>
        <Nav selected='Difference' />
      </Header>
      <Content style={{ padding: '10px' }}>
        <div
          style={{
            marginBottom: 10,
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Cascader
            dropdownRender={menus => {
              return (
                <div>
                  {menus}
                  <Divider style={{ margin: 0 }} />
                  <div style={{ padding: 8 }}>Length/Gene</div>
                </div>
              );
            }}
            size='large'
            allowClear={false}
            showSearch={true}
            defaultValue={[
              cascaderOptions[1].value,
              cascaderOptions[1].children[1].value,
            ]}
            options={cascaderOptions}
            onChange={update}
          />
        </div>
        <ReactECharts
          ref={echartRef}
          option={{}}
          style={{ height: height, width: '100%' }}
        />
      </Content>
    </Layout>
  );
}

export async function getStaticProps() {
  // let cascaderOptions = (await import('../data/cascaderOptions.json')).default;
  let _cascaderOptions = [...cascaderOptions];

  _cascaderOptions.forEach(x => {
    x.children.splice(0, 0, {
      value: 'info',
      label: 'Gene',
      disabled: true,
    });
  });
  _cascaderOptions.splice(0, 0, {
    value: 'info',
    label: 'Length',
    disabled: true,
  });
  return {
    props: { cascaderOptions: _cascaderOptions },
  };
}
