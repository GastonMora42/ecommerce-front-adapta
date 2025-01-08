import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";

const Section = styled.section`
 padding: 80px 0;
 background: #000;
 position: relative;
 
 &::after {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 1px;
   background: linear-gradient(90deg, transparent, #38b6ff, transparent);
 }
`;

const Title = styled.h2`
 font-size: 2.5rem;
 margin-bottom: 60px;
 font-weight: 600;
 color: white;
 text-align: center;
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

const GridWrapper = styled.div`
 margin-top: 40px;
 transition: all 0.3s ease;

 &:hover {
   transform: translateY(-5px);
 }
`;

const ProductEmoji = styled.span`
 display: inline-block;
 margin-left: 10px;
 filter: drop-shadow(0 0 5px #38b6ff);
`;

export default function NewProducts({products}) {
 return (
   <Section>
     <Center>
       <Title>
         Nuevos productos
         <ProductEmoji role="img" aria-label="mushroom">🍄</ProductEmoji>
       </Title>
       <GridWrapper>
         <ProductsGrid products={products} />
       </GridWrapper>
     </Center>
   </Section>
 );
}