import Nav from '../components/nav.js'
import { useState, useEffect, useRef } from 'react'
import { Layout, Input, AutoComplete } from 'antd'
import Head from 'next/head'
import { RightOutlined } from '@ant-design/icons'
const { Header, Content } = Layout
import data from '../data/mydata/blast_result.json'
import species from '../data/mydata/species.json'
import genes from '../data/mydata/detail_list.json'
function Showcontent ({ stringDatas, species, genedata }) {
  const [showspecies, setShowspecies] = useState([])
  // const Cspecies = useRef(species)
  const cspecies = useRef('')
  const cstringDatas = useRef(new Array())
  cspecies.current = species
  cstringDatas.current = stringDatas
  // console.log(cstringDatas.current)
  // cstringDatas.current = stringDatas
  useEffect(() => {
    // console.log(cstringDatas.current)
    //根据第一个输入框的值过滤（物种）
    if (species !== '') {
      cspecies.current = cspecies.current.split("_")[0]
      cstringDatas.current = cstringDatas.current.filter(dd => cspecies.current === dd.ename)
    }
    // console.log(cstringDatas.current)
    //根据第二个输入框的值过滤（基因）
    if (genedata !== '') {
      cstringDatas.current = cstringDatas.current.filter(dd => {
        let iiii = dd.name.indexOf(genedata)
        if (iiii !== -1) { return 1 }//保留
        else { return 0 }//过滤
      })
    }
    console.log(cstringDatas.current)
    console.log(species)
    // console.log(cspecies.current)
    setShowspecies(cstringDatas.current)
  }, [species, genedata])
  return (
    <div >
      {showspecies.map((item, index) =>
        <div key={index}>
          <RightOutlined style={{ marginLeft: 8, fontSize: '20px', color: '#888' }} />
          <p className="font-extrabold italic" >查询基因：<font className="italic font-thin">{item.name}</font></p>
          <p className="font-extrabold italic" >比对物种：<font className="italic font-thin">{item.db}</font></p>
          <table >
            <tbody >
              {item.tr.map((item2, index2) => {
                let bg = item.color_label
                return (
                  <tr key={index2}>
                    {item2.map((char, index3) =>
                      <td bgcolor={bg[index3]} key={index3}>
                        {char}
                      </td>)}
                  </tr>)
              }
              )}
            </tbody>
          </table>
          <p></p>
          <p></p>
        </div>
      )}
      { }
      { }
    </div>
  )
}
export default function Detail () {
  const [selectedItems, setSelectedItems] = useState('Anas platyrhynchos_绿头鸭')
  const [selectedGenes, setSelectedGenes] = useState('')
  let stringDatas = []
  for (let index = 0; index < data.length; index++) {
    const nowdata = data[index]
    let db = nowdata.full_name
    let ename = nowdata.species
    for (let q = 0; q < nowdata.chr_node.length; q++) {
      for (let str_i = 0; str_i < nowdata.chr_node[q].children.length; str_i++) {
        let str_node = nowdata.chr_node[q].children[str_i]
        if (str_node.type === 'seq') {
          const w = str_node.flag_seq_content
          const b = w.split('')
          let color_label = []
          b.map((item) => {
            if (item === ' ') {
              color_label.push('BEE7E9')
            }
            else if (item === '+') {
              color_label.push('A0EEE1')
            }
            //选择特殊的密码子
            else if (item === 'C') { color_label.push('#ff1244') }
            else {
              color_label.push('19CAAD')
            }
          })
          const q = str_node.query_seq_content
          const f = str_node.flag_seq_content
          const s = str_node.sbjct_seq_conten
          const q1 = q.split('')
          const f1 = f.split('')
          const s1 = s.split('')
          const str_node_data = {
            db: db,
            ename: ename,
            name: str_node.name,
            query: q1,
            flag: f1,
            sbjct: s1,
            tr: [q1, f1, s1],
            // tr: [str_node.query_seq_content, str_node.flag_seq_content, str_node.sbjct_seq_conten],
            // tr: {query:str_node.query_seq_content, 
            //   flag:str_node.flag_seq_content, 
            //   sbjct:str_node.sbjct_seq_conten
            // },
            color_label: color_label,
          }
          stringDatas.push(str_node_data)
        }
      }
    }
  }
  return (
    <Layout>
      <Head>
        <title>Detail</title>
      </Head>
      <Header>
        <Nav selected='detail' />
      </Header>
      <Content style={{ padding: 10 }}>
        <Input.Group
          compact
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <AutoComplete
            options={species}
            style={{ width: '30%' }}
            onSelect={e => { setSelectedItems(e) }}
          >
            <Input.Search
              size='large'
              placeholder='input species here'
              enterButton
              onSearch={e => { setSelectedItems(e) }}
              allowClear={true}
            />
          </AutoComplete>
          <AutoComplete
            options={genes}
            style={{ width: '30%' }}
            onSelect={e => { setSelectedGenes(e) }}
          >
            <Input.Search
              size='large'
              placeholder='input gene here'
              enterButton
              onSearch={e => { setSelectedGenes(e) }}
              allowClear={true}
            />
          </AutoComplete>
        </Input.Group>
        <br></br>
        <Showcontent stringDatas={stringDatas} species={selectedItems} genedata={selectedGenes}></Showcontent>
      </Content>
    </Layout>
  )
}
