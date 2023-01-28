export default function Test({ data }) {
  console.log(data);
  return (
    <ul>{data.length>0 ? data.map(x => <li key={x}>{x}</li>) : <div>empty</div>}</ul>
  );
}

export async function getStaticProps({ params }) {
  if (params.data == undefined) params.data = [];
  return {
    props: { data: params.data },
  };
}

export async function getStaticPaths() {
  return { paths: [{ params: { data: [] } }], fallback: 'blocking' };
}
