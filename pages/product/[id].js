import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";

const PageContainer = styled.div`
 background: #000;
 min-height: 100vh;
 padding: 40px 0;
`;

const ColWrapper = styled.div`
 display: grid;
 grid-template-columns: 1fr;
 @media screen and (min-width: 768px) {
   grid-template-columns: 1fr 1fr;
 }
 gap: 60px;
 margin: 40px 0;
`;

const ProductBox = styled(WhiteBox)`
 background: rgba(255, 255, 255, 0.03);
 border: 1px solid rgba(56, 182, 255, 0.1);
 border-radius: 12px;
 padding: 20px;
 transition: all 0.3s ease;
 
 &:hover {
   box-shadow: 0 0 20px rgba(56, 182, 255, 0.1);
 }
`;

const ProductInfo = styled.div`
 color: #fff;
`;

const ProductTitle = styled(Title)`
 color: #38b6ff;
 font-size: 2.2rem;
 margin-bottom: 20px;
`;

const Description = styled.p`
 color: #fff;
 font-size: 1.1rem;
 line-height: 1.6;
 margin-bottom: 30px;
 opacity: 0.9;
`;

const PriceRow = styled.div`
 display: flex;
 gap: 30px;
 align-items: center;
 margin-top: 40px;
 padding: 20px;
 background: rgba(56, 182, 255, 0.05);
 border-radius: 12px;
`;

const Price = styled.span`
 font-size: 2rem;
 font-weight: 600;
 color: #38b6ff;
`;

const BuyButton = styled(Button)`
 background-color: #38b6ff;
 color: #000;
 padding: 15px 30px;
 border-radius: 8px;
 font-size: 1.1rem;
 display: flex;
 align-items: center;
 gap: 10px;
 transition: all 0.3s ease;
 border: 1px solid transparent;

 &:hover {
   background-color: transparent;
   color: #38b6ff;
   border-color: #38b6ff;
   transform: translateY(-2px);
 }

 svg {
   width: 20px;
   height: 20px;
 }
`;

export default function ProductPage({product}) {
 const {addProduct} = useContext(CartContext);
 
 return (
   <PageContainer>
     <Header />
     <Center>
       <ColWrapper>
         <ProductBox>
           <ProductImages images={product.images} />
         </ProductBox>
         <ProductInfo>
           <ProductTitle>{product.title}</ProductTitle>
           <Description>{product.description}</Description>
           <PriceRow>
             <Price>${product.price}</Price>
             <BuyButton onClick={() => addProduct(product._id)}>
               <CartIcon />
               Añadir al carrito
             </BuyButton>
           </PriceRow>
         </ProductInfo>
       </ColWrapper>
     </Center>
   </PageContainer>
 );
}

export async function getServerSideProps(context) {
 await mongooseConnect();
 const {id} = context.query;
 const product = await Product.findById(id);
 return {
   props: {
     product: JSON.parse(JSON.stringify(product)),
   }
 }
}