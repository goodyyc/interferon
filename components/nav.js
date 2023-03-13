import { Menu, FloatButton } from 'antd'
import Link from 'next/link'
import { DownOutlined } from '@ant-design/icons'
const { SubMenu } = Menu
import Head from 'next/head'

export default function Nav ({ selected }) {
  return (
    <>
      <Head>
        {/* import icon */}
        <link rel='icon' href='/interferon/favicon.png' />
      </Head>

      <FloatButton.BackTop />
      <Menu
        className=''
        mode='horizontal'
        defaultSelectedKeys={[selected]}
        items={[
          { key: 'Index', label: <Link href='/'>Index</Link> },
          { key: 'Tree', label: <Link href='/tree'>Tree</Link> },
          {
            key: 'Difference',
            label: <Link href='/difference'>Difference</Link>,
          },
          {
            key: 'Chromosome',
            label: <Link href='/chromosome'>Chromosome</Link>,
          },
          {
            key: 'Heatmap',
            label: 'Heatmap',
            icon: <DownOutlined />,
            children: [
              {
                key: 'Gene',
                label: <Link href='/geneHeatmap'>Gene</Link>,
              },
              {
                key: 'Protein',
                label: <Link href='/proteinHeatmap'>Protein</Link>,
              },
            ],
          },
          { key: 'Align', label: <Link href='/proteinAlign/main'>Align</Link> },
          {
            key: 'Query',
            label: 'Query',
            icon: <DownOutlined />,
            children: [
              {
                key: 'QueryAll',
                label: <Link href='/queryAll'>Query All</Link>,
              },
              {
                key: 'QueryInterferon',
                label: <Link href='/queryInterferon'>Query Interferon</Link>,
              },
            ],
          },
          {
            key: 'Translocation',
            label: <Link href='/translocation'>Translocation</Link>,
          },
          {
            key: 'Newseq',
            label: <Link href='/newseq'>Newseq</Link>,
          },
          {
            key: 'Detail',
            label: <Link href='/detail'>Detail</Link>,
          },
          {
            key: 'Neighbor',
            label: <Link href='/neighbor'>Neighbor</Link>,
          },
        ]}
      />
    </>
  )
}
