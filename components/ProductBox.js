// ProductBox.jsx
import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

const ProductWrapper = styled.div`
 background: rgba(255, 255, 255, 0.05);
 border-radius: 12px;
 padding: 15px;
 transition: all 0.3s ease;
 border: 1px solid rgba(56, 182, 255, 0.1);

 &:hover {
   transform: translateY(-5px);
   box-shadow: 0 5px 15px rgba(56, 182, 255, 0.2);
 }
`;

const WhiteBox = styled(Link)`
 background-color: rgba(255, 255, 255, 0.03);
 padding: 20px;
 height: 200px;
 text-align: center;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 8px;
 overflow: hidden;
 transition: all 0.3s ease;

 img {
   max-width: 100%;
   max-height: 160px;
   object-fit: cover;
   transition: all 0.3s ease;
 }

 &:hover img {
   transform: scale(1.05);
 }
`;

const Title = styled(Link)`
 font-weight: 500;
 font-size: 1.1rem;
 color: #fff;
 text-decoration: none;
 margin: 10px 0;
 display: block;
 transition: color 0.3s ease;

 &:hover {
   color: #38b6ff;
 }
`;

const ProductInfoBox = styled.div`
 margin-top: 15px;
`;

const PriceRow = styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-top: 15px;
 flex-wrap: wrap;
 gap: 10px;
`;

const Price = styled.div`
 font-size: 1.2rem;
 font-weight: 600;
 color: #38b6ff;
`;

const AddToCartButton = styled(Button)`
 background-color: transparent;
 color: #38b6ff;
 border: 1px solid #38b6ff;
 padding: 8px 15px;
 border-radius: 6px;
 transition: all 0.3s ease;

 &:hover {
   background-color: #38b6ff;
   color: #000;
   transform: translateY(-2px);
 }
`;

export default function ProductBox({ _id, title, description, price, images }) {
 const { addProduct } = useContext(CartContext);
 const url = '/product/' + _id;

 return (
   <ProductWrapper>
     <WhiteBox href={url}>
       <img src={images?.[0]} alt={title} />
     </WhiteBox>
     <ProductInfoBox>
       <Title href={url}>{title}</Title>
       <PriceRow>
         <Price>${price}</Price>
         <AddToCartButton onClick={() => addProduct(_id)}>
           Añadir al carrito
         </AddToCartButton>
       </PriceRow>
     </ProductInfoBox>
   </ProductWrapper>
 );
}

