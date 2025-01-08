import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Footer from "@/components/Footer";

const PageContainer = styled.div`
 background: #000;
 min-height: 100vh;
`;

const MainContent = styled.main`
 padding: 60px 0;
`;

const ProductsTitle = styled(Title)`
 color: #38b6ff;
 font-size: 2.5rem;
 text-align: center;
 margin-bottom: 50px;
 position: relative;

 &::after {
   content: '';
   position: absolute;
   bottom: -15px;
   left: 50%;
   transform: translateX(-50%);
   width: 80px;
   height: 3px;
   background: #38b6ff;
   box-shadow: 0 0 10px #38b6ff;
 }
`;

const GridContainer = styled.div`
 margin-top: 40px;
 min-height: 60vh; // Asegura espacio suficiente antes del footer
`;

export default function ProductsPage({products}) {
 return (
   <PageContainer>
     <Header />
     <MainContent>
       <Center>
         <ProductsTitle>Todos los productos</ProductsTitle>
         <GridContainer>
           <ProductsGrid products={products} />
         </GridContainer>
       </Center>
     </MainContent>
     <Footer />
   </PageContainer>
 );
}

export async function getServerSideProps() {
 await mongooseConnect();
 const products = await Product.find({}, null, {sort:{'_id':-1}});
 return {
   props:{
     products: JSON.parse(JSON.stringify(products)),
   }
 };
}