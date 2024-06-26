import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import useSWR from 'swr';

// Cargar dinámicamente los componentes para mejorar el rendimiento inicial
const Featured = dynamic(() => import('@/components/Featured'));
const NewProducts = dynamic(() => import('@/components/NewProducts'));

export default function HomePage({ featuredProduct }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProductsWrapper />
    </div>
  );
}

// Componente que carga los nuevos productos de manera asíncrona
const NewProductsWrapper = () => {
  const { data, error } = useSWR('/api/new-products', fetcher);

  if (error) return <div>Error al cargar los nuevos productos.</div>;
  if (!data) return <div>Cargando...</div>;

  return <NewProducts products={data} />;
};

// Fetcher para usar con SWR
const fetcher = url => fetch(url).then(res => res.json());

export async function getServerSideProps() {
  const featuredProductId = '640de2b12aa291ebdf213d48';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId).lean();

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
    },
  };
}
