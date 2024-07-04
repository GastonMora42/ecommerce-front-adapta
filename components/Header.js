import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import Notificacion from "@/components/Notificacion"; // Importamos el componente de notificación

const StyledHeader = styled.header`
  background-color: #222;
  color: white;
  padding: 5px 0;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000; /* Asegura que el header esté por encima de otros elementos */
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  ${(props) => (props.mobileNavActive ? `display: block;` : `display: none;`)}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  margin-top: 9px;
  padding: 10px 0;
  font-size: 100%;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;

  img {
    width: 150px;
    height: auto;
  }
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">
            <img src="/titulo-adapta.png" alt="img-titulo" className="img-titulo" />
          </Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/products">Todos los productos</NavLink>
            <NavLink id="cart-title" href="/cart">
              Tu carrito({cartProducts.length})
            </NavLink>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
      <Notificacion /> {/* Añadimos el componente de notificación aquí */}
    </StyledHeader>
  );
}
