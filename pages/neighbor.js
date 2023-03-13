import Nav from '../components/nav.js'
import { useState, useEffect, useRef } from 'react'
import { Layout, Input, Button, Tooltip } from 'antd'
import * as echarts from 'echarts'
import Head from 'next/head'
// import species from '../data/mydata/five_species_list.json'
import all from '../data/mydata/five_genes.json'
const { Header, Footer, Sider, Content } = Layout
import { useAntdTable } from 'ahooks'
import { Table, Form } from 'antd'
export default function Newseq () {
  const columns = [
    {
      title: 'Five',
      dataIndex: 'ffive',
      key: 'ffive',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Four',
      dataIndex: 'ffour',
      key: 'ffour',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Three',
      dataIndex: 'fthree',
      key: 'fthree',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Two',
      dataIndex: 'ftwo',
      key: 'ftwo',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },

    },
    {
      title: 'One',
      dataIndex: 'fone',
      key: 'fone',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },

    },
    {
      title: 'Gene',
      dataIndex: 'gene',
      key: 'gene',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[1]
        //chromosome
        let ddd_up = text.split("*")[0]
        let ddd_start = text.split("*")[2]
        let ddd_end = text.split("*")[3]
        let ddd_species = text.split("*")[4]
        let ddd_product = text.split("*")[5]

        let prompt_str = 'chromosome: ' + ddd_up + '\n' +
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'species:' + ddd_species + '\n' +
          'product:' + ddd_product
        return (<Tooltip title={prompt_str} color="cyan">
          <a class='select-all cursor-pointer' >
            {ddd_show}
          </a>
        </Tooltip>
        )
      },
    },
    {
      title: 'One',
      dataIndex: 'bone',
      key: 'bone',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },

    },
    {
      title: 'Two',
      dataIndex: 'btwo',
      key: 'btwo',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Three',
      dataIndex: 'bthree',
      key: 'bthree',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Four',
      dataIndex: 'bfour',
      key: 'bfour',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
    {
      title: 'Five',
      dataIndex: 'bfive',
      key: 'bfive',
      render: (text, record, index) => {
        let ddd_show = text.split("*")[0]
        let ddd_start = text.split("*")[1]
        let ddd_end = text.split("*")[2]
        let ddd_product = text.split("*")[3]
        let prompt_str =
          'start:' + ddd_start + '\n' +
          'end:' + ddd_end + '\n' +
          'product:' + ddd_product + '\n'
        return (<Tooltip title={prompt_str} color="cyan">
          <p class='select-all cursor-pointer'>{ddd_show}</p>
        </Tooltip>
        )
      },
    },
  ]
  let groupdatas = []
  let num = 0
  let gene_num = 5
  //这个for循环生成groupdatas中数据
  for (let q = 0; q < all.length; q++) {
    const d = all[q]
    let front_str_list = all[q].l_gene_list
    let tail_str_list = all[q].r_gene_list
    let gene_node = all[q].gene
    let gene_name = gene_node.gene
    //只显示中文物种名和基因名
    //let show_name = gene_name.split("_")[1] + '\n' + gene_name.split("_")[2]
    let show_data = gene_node.chromosome + '*' + gene_name + '*' + gene_node.start + '*' + gene_node.end + '*' + gene_node.species + '_' + gene_node.cname + '*' + gene_node.product
    let l_text_list = []
    for (let ooo = 0; ooo < gene_num; ooo++) {
      let str = front_str_list[ooo].gene + '*' + front_str_list[ooo].start + '*' + front_str_list[ooo].end + '*' + front_str_list[ooo].product
      l_text_list.push(str)
    }
    let r_text_list = []
    for (let ooo2 = 0; ooo2 < gene_num; ooo2++) {
      let str2 = tail_str_list[ooo2].gene + '*' + tail_str_list[ooo2].start + '*' + tail_str_list[ooo2].end + '*' + tail_str_list[ooo2].product
      r_text_list.push(str2)
    }
    const new_node = {
      key: num,
      ffive: l_text_list[0],
      ffour: l_text_list[1],
      fthree: l_text_list[2],
      ftwo: l_text_list[3],
      fone: l_text_list[4],
      gene: show_data,
      bone: r_text_list[0],
      btwo: r_text_list[1],
      bthree: r_text_list[2],
      bfour: r_text_list[3],
      bfive: r_text_list[4],
    }
    groupdatas.push(new_node)
    num = num + 1
  }
  const [form] = Form.useForm()
  async function getData (page, formData) {
    console.log(page, formData)
    let temp = groupdatas
    let tempIncludes = ['species', 'gene']
    // let tempPlus = ['exon'];
    console.log(formData)
    for (let x of tempIncludes) {
      temp = temp.filter(d => !formData[x] || d["gene"].toLowerCase().includes(formData[x].toLowerCase()))
    }
    //temp = temp.filter(d => !formData["species"] || d["gene"].includes(formData["species"]))
    const total = temp.length
    temp = temp.slice(
      (page.current - 1) * page.pageSize,
      page.current * page.pageSize
    )
    return { total: total, list: temp }
  }
  const { tableProps, search, params } = useAntdTable(getData, {
    defaultPageSize: 10,
    form,
  })
  const { submit } = search
  return (
    <Layout>
      <Head>
        <title>Neighbor</title>
      </Head>
      <Header>
        <Nav selected='Neighbor' />
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
          </Form>
        </div>
        <Table columns={columns} rowKey='gene' {...tableProps} />
      </Content>
    </Layout>
  )
}