import Head from 'next/head';
import tree from '../data/tree.json';
import Nav from '../components/nav.js';
import { useState, useEffect, useRef } from 'react';
import { Layout, Input, Select, AutoComplete } from 'antd';
import queryData from '../data/query.json';
import species from '../data/sortedSpecies.json';

import { useAntdTable } from 'ahooks';
import { Table, Form } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function Query({ datas, columns }) {
  // define random name and phone list
  const [form] = Form.useForm();
  async function getData(page, formData) {
    let temp = datas;
    let tempIncludes = ['species', 'gene', 'protein', 'neighbors'];
    let tempPlus = ['exon'];
    for (let x of tempIncludes) {
      temp = temp.filter(d => !formData[x] || d[x].includes(formData[x]));
    }
    for (let x of tempPlus) {
      temp = temp.filter(d => !formData[x] || d[x] >= formData[x]);
    }
    const total = temp.length;
    temp = temp.slice(
      (page.current - 1) * page.pageSize,
      page.current * page.pageSize
    );
    return { total: total, list: temp };
  }
  const { tableProps, search, params } = useAntdTable(getData, {
    defaultPageSize: 10,
    form,
  });
  const { submit } = search;
  return (
    <Layout>
      <Head>
        <title>Query</title>
      </Head>
      <Header>
        <Nav selected='Query' />
      </Header>
      <Content style={{ padding: 10 }}>
        <div style={{ marginBottom: 16 }}>
          <Form
            form={form}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Form.Item name='species'>
              <Input.Search
                placeholder='enter species'
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item name='gene'>
              <Input.Search
                placeholder='enter gene'
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item name='protein'>
              <Input.Search
                placeholder='enter protein'
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item name='exon'>
              <Input.Search
                placeholder='enter exon'
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item name='neighbors'>
              <Input.Search
                placeholder='enter neighbors(HACD4/UBAP2/MATP)'
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={columns}
          rowKey={record => record.protein + record.start}
          {...tableProps}
        />
      </Content>
    </Layout>
  );
}

export async function getStaticProps() {
  let translation = {};
  for (let x of species) {
    translation[x[0]] = x[1];
  }
  let datas = JSON.parse(JSON.stringify(queryData));
  for (let x of datas) {
    x['species'] += '_' + translation[x['species']];
  }
  const columns = [
    {
      title: 'Species',
      dataIndex: 'species',
    },
    {
      title: 'Gene',
      dataIndex: 'gene',
    },
    {
      title: 'Start',
      dataIndex: 'start',
    },
    {
      title: 'End',
      dataIndex: 'end',
    },
    {
      title: 'Exon',
      dataIndex: 'exon',
    },
    {
      title: 'Protein',
      dataIndex: 'protein',
    },
    {
      title: 'Protein Length',
      dataIndex: 'proteinLength',
    },
    // {
    //   title: 'exon',
    //   dataIndex: 'exon',
    // },
    // {
    //   title: 'exon position',
    //   dataIndex: 'exonPos',
    // },
    {
      title: 'Neighbors',
      dataIndex: 'neighbors',
    },
  ];
  return {
    props: {
      datas,
      columns,
    },
  };
}
