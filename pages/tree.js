import Head from 'next/head';
import tree from '../data/tree.json';
import ReactECharts from 'echarts-for-react';
import Nav from '../components/nav.js';
import { useEffect, useRef } from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function Tree() {
  const echartRef = useRef();
  useEffect(() => {
    let option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          id: 0,
          name: 'tree1',
          data: [tree],
          top: '3%',
          left: '10%',
          bottom: '3%',
          right: '4%',
          symbolSize: 7,
          edgeShape: 'polyline',
          edgeForkPosition: '63%',
          initialTreeDepth: 5,
          lineStyle: {
            width: 2,
          },
          label: {
            padding: 3,
            backgroundColor: '#fff0',
            position: 'bottom',
            verticalAlign: 'middle',
            align: 'right',
          },
          leaves: {
            label: {
              position: 'bottom',
              verticalAlign: 'middle',
              align: 'right',
            },
            itemStyle: {
              color: '#f00',
            },
          },
          emphasis: {
            focus: 'descendant',
          },
          expandAndCollapse: false,
          edgeForkPosition: 0.3,
          annimation: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };
    echartRef.current.getEchartsInstance().setOption(option);
    echartRef.current.getEchartsInstance().on('click', e=> {
      let el = document.createElement('textarea');
      el.value = e.data.name.split('_')[0];
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      console.log(e);
    })
  }, []);
  return (
    <Layout>
      <Head>
        <title>Tree</title>
      </Head>
      <Header>
        <Nav selected='Tree' />
      </Header>
      <Content>
        <ReactECharts
          ref={echartRef}
          option={{}}
          style={{ height: '2000px', width: '100%' }}
        />
      </Content>
    </Layout>
  );
}
