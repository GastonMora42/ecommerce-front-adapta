// Footer.jsx
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const FooterContainer = styled.footer`
  background-color: #000;
  color: white;
  padding: 40px 0 20px;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  align-items: center;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr 1fr;
    text-align: left;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
  
  img {
    max-width: 120px;
    height: auto;
  }
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #38b6ff;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #38b6ff;
    
    &:after {
      width: 100%;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LogoContainer>
          <Image 
            src="/titulo-adapta.png" 
            alt="Adapta Logo" 
            width={120}
            height={40}
            priority
          />
        </LogoContainer>
        
        <FooterText>
          &copy; {new Date().getFullYear()} Adapta. Todos los derechos reservados.
        </FooterText>
        
        <FooterLinks>
          <FooterLink href="/privacidad">Privacidad</FooterLink>
          <FooterLink href="/terminos">Términos</FooterLink>
          <FooterLink href="/contacto">Contacto</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;