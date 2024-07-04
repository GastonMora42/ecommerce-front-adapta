import styled from "styled-components";
import Link from "next/link";

const FooterContainer = styled.footer`
  background-color: #222;
  color: white;
  padding: 20px 0;
  position: fixed-bot;
  margin-top: 50px;
  width: 100%;
  bottom: 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  margin-top: 10px;

  a {
    color: white;
    text-decoration: none;
    margin: 0 10px;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: left;
  z-index: 3;

  img {
    width: 150px;
    height: auto;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
      <Logo href="/">
            <img src="/titulo-adapta.png" alt="img-titulo" className="img-titulo" />
          </Logo>
        <FooterText>&copy; {new Date().getFullYear()} Adapta. Todos los derechos reservados.</FooterText>
        <FooterLinks>
          <Link href="/">Política de Privacidad</Link>
          <Link href="/">Términos de Servicio</Link>
          <Link href="/">Contacto</Link>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
