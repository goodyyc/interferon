import Head from 'next/head';
import tree from '../../data/tree.json';
import Nav from '../../components/nav.js';
import { useState, useEffect, useRef } from 'react';
import { Layout, Cascader } from 'antd';
import geneSequencesCascaderOptions from '../../data/proteinSequencesCascaderOptions.json';
import geneSequences from '../../data/proteinSequences.json';
const { Header, Footer, Sider, Content } = Layout;
import { useRouter } from 'next/router';

// const Nav = dynamic(import('../components/nav.js'), { ssr: false });

function GeneAlign({ gene1, gene2 }) {
  function less(m1, m2) {
    return m1[0] < m2[0] || (m1[0] == m2[0] && m1[1] < m2[1]);
  }
  // return <div></div>;
  // if gene is not number, return
  if (gene1 === '' || gene2 === '') {
    return <div>?</div>;
  }
  let a = geneSequences[gene1];
  let b = geneSequences[gene2];
  // a = '41234123412412312431331414341234144131423131342143214321234131234';
  // b = '41341234123412414123413432431412342431343123414321434123413211234';
  let f = new Array(a.length + 1);
  let pre = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) {
    f[i] = new Array(b.length + 1);
    pre[i] = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) {
      f[i][j] = new Array(2);
      pre[i][j] = new Array(2);
    }
  }

  for (let i = 0; i <= a.length; i++)
    for (let j = 0; j <= b.length; j++)
      for (let k = 0; k < 2; k++) {
        f[i][j][k] = [0, 0];
        pre[i][j][k] = [i - 1, j - 1, 0];
      }
  for (let i = 1; i <= a.length; i++) {
    for (let k = 0; k < 2; k++) {
      pre[i][0][k] = [i - 1, 0, 0];
    }
  }
  for (let j = 0; j <= b.length; j++) {
    for (let k = 0; k < 2; k++) {
      pre[0][j][k] = [0, j - 1, 0];
    }
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      f[i][j][0] = [...f[i - 1][j - 1][0]];
      pre[i][j][0] = [i - 1, j - 1, 0];
      if (less(f[i][j][0], f[i - 1][j - 1][1])) {
        f[i][j][0] = [...f[i - 1][j - 1][1]];
        pre[i][j][0] = [i - 1, j - 1, 1];
      }
      f[i][j][0][1] += 1;
      if (a[i - 1].toLowerCase() == b[j - 1].toLowerCase()) {
        f[i][j][1] = [...f[i - 1][j - 1][0]];
        pre[i][j][1] = [i - 1, j - 1, 0];
        f[i][j][1][0] += 1;
        if (less(f[i][j][1], f[i - 1][j - 1][1])) {
          f[i][j][1] = [...f[i - 1][j - 1][1]];
          pre[i][j][1] = [i - 1, j - 1, 1];
          f[i][j][1][0] += 1;
          f[i][j][1][1] += 2;
        }
      }
      let ds = [
        { x: -1, y: 0 },
        { x: 0, y: -1 },
      ];
      for (let d of ds) {
        let x = i + d.x;
        let y = j + d.y;
        for (let k = 0; k < 2; k++) {
          if (less(f[i][j][0], f[x][y][k])) {
            f[i][j][0] = [...f[x][y][0]];
            pre[i][j][0] = [x, y, k];
          }
        }
      }
    }
  }
  let x = a.length;
  let y = b.length;
  let k = 0;
  if (less(f[x][y][0], f[x][y][1])) k = 1;
  let aa = [];
  let bb = [];
  while (x > 0 || y > 0) {
    let [nx, ny, nk] = pre[x][y][k];
    if (nx == x - 1 && ny == y - 1) {
      aa.push(a[nx]);
      bb.push(b[ny]);
    } else if (nx == x - 1) {
      aa.push(a[nx]);
      bb.push('-');
    } else {
      aa.push('-');
      bb.push(b[ny]);
    }
    x = nx;
    y = ny;
    k = nk;
  }
  aa.reverse();
  bb.reverse();
  // let same letter bold
  let aa2 = [];
  let bb2 = [];
  let show = [];
  let same = 0;
  let color = [
    '#5B8FF9',
    '#61DDAA',
    '#F6BD16',
    '#7262fd',
    '#78D3F8',
    '#9661BC',
    '#F6903D',
    '#008685',
    '#F08BB4',
    '#65789B',
  ];
  for (let i = 0; i < aa.length; i++) {
    let mp = { '-': 'c' };
    if (aa[i] != '-' && aa[i].toLowerCase() == bb[i].toLowerCase()) {
      same++;
      aa2.push({ value: aa[i], color: color[0] });
      bb2.push({ value: aa[i],color: color[0] });
    } else {
      aa2.push({ value: aa[i] });
      bb2.push({ value: bb[i] });
    }
    // change line every 20
    let lineLength=60;
    if (i % lineLength == lineLength-1 || i == aa.length - 1) {
      show.push(aa2, bb2);
      aa2 = [];
      bb2 = [];
      same = 0;
    }
  }
  let samePercent = (same / aa.length) * 100;
  return (
    <div style={{ justifyContent: 'center', display: 'flex' }}>
      <div style={{ fontFamily: 'monospace' }} key='align'>
        <table>
          <tbody>
            {show.map((item, cnt) => (
              <tr key={cnt}>
                {item.map((item2, cnt2) => (
                  <td
                    key={cnt2}
                    className={item2.className}
                    style={{ backgroundColor: item2.color }}
                  >
                    {item2.bold ? <b>{item2.value}</b> : item2.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Align({ align }) {
  const [gene1, setGene1] = useState(align[1]);
  const [gene2, setGene2] = useState(align[3]);
  return (
    <Layout>
      <Head>
        <title>Align</title>
      </Head>
      <Header>
        <Nav selected='Align' />
      </Header>
      <Content>
        <div style={{ padding: 10, justifyContent: 'center', display: 'flex' }}>
          <Cascader
            size='large'
            allowClear={false}
            showSearch={true}
            defaultValue={[align[0], align[1]]}
            options={geneSequencesCascaderOptions}
            onChange={e => setGene1(e[1])}
            style={{ width: '30%' }}
          />
          <Cascader
            size='large'
            allowClear={false}
            showSearch={true}
            defaultValue={[align[2], align[3]]}
            options={geneSequencesCascaderOptions}
            onChange={e => setGene2(e[1])}
            style={{ width: '30%' }}
          />
        </div>
        <GeneAlign gene1={gene1} gene2={gene2} />
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  let temp;
  if (params.align === undefined)
    temp = [
      'Anas platyrhynchos',
      '61a85ac7bae1e2f3d68ef829',
      'Aythya fuligula',
      '61a85ae0bae1e2f3d68ef82d',
    ];
  else temp = params.align;
  return {
    props: { align: temp },
  };
}

export async function getStaticPaths() {
  return { paths: [{ params: { align: [] } }], fallback: 'blocking' };
}
