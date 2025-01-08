import Link from "next/link";
import styled from "styled-components";
import { ShoppingCart, Menu } from 'lucide-react';
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";

const StyledHeader = styled.header`
  background-color: #000;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  color: #38b6ff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2d91cc;
  }

  img {
    width: 150px;
    height: auto;
  }
`;

const StyledNav = styled.nav`
  display: none;
  gap: 2rem;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 500;
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

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const CartButton = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #38b6ff;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: block;
  transition: color 0.3s ease;

  @media (min-width: 768px) {
    display: none;
  }
  
  &:hover {
    color: #38b6ff;
  }
`;

const CartCount = styled.span`
  background-color: #38b6ff;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const MobileNav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 999;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  return (
    <StyledHeader>
      <HeaderContainer>
        <Logo href="/">
          <img src="/titulo-adapta.png" alt="Logo" />
        </Logo>
        
        <StyledNav>
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/products">Productos</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/contact">Contacto</NavLink>
        </StyledNav>

        <IconsContainer>
          <CartButton href="/cart">
            <ShoppingCart size={24} />
            <CartCount>{cartProducts.length}</CartCount>
          </CartButton>
          <MenuButton onClick={() => setMobileNavActive(!mobileNavActive)}>
            <Menu size={24} />
          </MenuButton>
        </IconsContainer>

        <MobileNav isOpen={mobileNavActive}>
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/products">Productos</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/contact">Contacto</NavLink>
        </MobileNav>
      </HeaderContainer>
    </StyledHeader>
  );
}