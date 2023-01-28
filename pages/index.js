import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import { Layout } from 'antd';
import Nav from '../components/nav.js';
import remarkGfm from 'remark-gfm';

const { Header, Footer, Sider, Content } = Layout;

export default function Home({ file }) {
  return (
    <Layout className="layout">
      <Header>
        <Nav selected='Index' />
      </Header>
      <Content className=''>
        <ReactMarkdown
          className='w-4/5 mx-auto my-5 p-5 markdown-body'
          remarkPlugins={[remarkGfm]}
        >
          {file}
        </ReactMarkdown>
      </Content>
    </Layout>
  );
}

export async function getStaticProps() {
  const file = fs.readFileSync('README.md', 'utf8');
  return {
    props: {
      file: file,
    },
  };
}
