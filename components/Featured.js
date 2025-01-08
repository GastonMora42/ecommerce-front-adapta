import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import Image from "next/image";

const Bg = styled.div`
 background-image: url('/fondo-adapta.png');
 background-size: cover;
 background-position: center;
 background-attachment: fixed;
 min-height: 80vh;
 position: relative;
 padding: 80px 0;
 
 &::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.6);
 }
`;

const Title = styled.h1`
 margin: 0;
 font-weight: bold;
 font-size: 2rem;
 color: #fff;
 position: relative;
 text-align: center;
 max-width: 800px;
 margin: 0 auto;
 @media screen and (min-width: 768px) {
   font-size: 3rem;
 }
`;

const LogoWrapper = styled.div`
 margin: 20px auto;
 max-width: 180px;
 img {
   width: 100%;
   height: auto;
 }
`;

const ContentWrapper = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 position: relative;
 padding: 20px;
`;

const ButtonsWrapper = styled.div`
 display: flex;
 justify-content: center;
 gap: 20px;
 margin-top: 40px;

 a {
   background-color: #38b6ff;
   color: white;
   border: none;
   
   &:hover {
     background-color: #2d91cc;
   }
 }
`;

export default function Featured() {
 return (
   <Bg>
     <Center>
       <ContentWrapper>
        <br></br>
        <br></br>
        <br></br>
         <Title>Descubrí el poder de los hongos adaptógenos</Title>
         <LogoWrapper>
           <Image 
             src="/logo-blanco.png" 
             alt="Logo Adapta" 
             width={180} 
             height={60} 
             priority
           />
         </LogoWrapper>
         <ButtonsWrapper>
           <ButtonLink href={'/products'}>
             Conoce todos nuestros productos
           </ButtonLink>
         </ButtonsWrapper>
       </ContentWrapper>
     </Center>
   </Bg>
 );
}