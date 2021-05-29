import Head from 'next/head';
import Banner from '../components/Banner';
import Header from '../components/Header';
import ProductFeed from '../components/ProductFeed';

export default function Home({ products }) {
  return (
    <div className='bg-gray-100'>
      <Head>
        <title>Sudo Amazon</title>
      </Head>
      <Header />

      <main className='max-w-screen-xl mx-auto '>
        {/* Banner */}
        <Banner />
        {/* Product Feed */}
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const products = await fetch('https://fakestoreapi.com/products').then(
    (res) => res.json()
  );

  return {
    props: {
      products,
    },
  };
};
