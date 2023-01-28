import Head from 'next/head';
import tree from '../data/tree.json';
import Nav from '../components/nav.js';
import { useState, useEffect, useRef } from 'react';
import { Layout, Input, Select, AutoComplete } from 'antd';
import queryData from '../data/query.json';
import species from '../data/sortedSpecies.json';

import { useAntdTable } from 'ahooks';
import { Table, Form, message } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

export default function QueryAll({ translation, columns }) {
  // define random name and phone list
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const [preDatas, setPreDatas] = useState({
    species: '',
    gene: '',
    datas: '',
  });
  async function getData(page, formData) {
    // use api/queryDatabase to get data
    let { species, gene } = formData;
    if (species === undefined || species === '') {
      species = '0';
    }
    if (gene === undefined || gene === '') {
      gene = '0';
    }

    if (species == preDatas.species && gene == preDatas.gene) {
      return { list: preDatas.datas, total: preDatas.datas.length };
    }
    const res = await fetch(`/interferon/api/queryDatabase/${species}/${gene}`);
    const datas = await res.json();
    setPreDatas({ species, gene, datas });
    if (datas.length == 1000) {
      messageApi.warning(
        'Due to performance limitations, for each query we only display the first 1000 matching records in the data.'
      );
    }
    return { total: datas.length, list: datas };
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
        {contextHolder}
        <div style={{ marginBottom: 16 }}>
          <Form
            form={form}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Form.Item name='species'>
              <Input.Search
                placeholder='enter species'
                // style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item name='gene'>
              <Input.Search
                placeholder='enter gene'
                // style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={columns}
          rowKey={record =>
            record.species + record.gene + record.chromosome + record.start
          }
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
      title: 'Chromosome',
      dataIndex: 'chromosome',
    },
    {
      title: 'Start',
      dataIndex: 'start',
    },
    {
      title: 'End',
      dataIndex: 'end',
    },
  ];

  return {
    props: { translation, columns },
  };
}
