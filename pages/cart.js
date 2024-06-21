"use client"
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { Router } from "express";


const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const CartPage = () => {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/create_order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error('Error during checkout:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cartProducts.length > 0) {
        const { data } = await axios.post("/api/cart", { ids: cartProducts });
        setProducts(data);
      } else {
        setProducts([]);
      }
    };
    fetchCartProducts();
  }, [cartProducts]);


  const total = cartProducts.reduce((acc, productId) => {
    const product = products.find(p => p._id === productId);
    return acc + (product ? product.price : 0);
  }, 0);

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && <div>Your cart is empty</div>}
            {products.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt={product.title} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => removeProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuantityLabel>
                        <Button onClick={() => addProduct(product._id)}>+</Button>
                      </td>
                      <td>
                        ${cartProducts.filter(id => id === product._id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2">Total</td>
                    <td>${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts.length && (
            <Box>
              <h2>Order information</h2>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                name="name"
                onChange={ev => setName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                name="email"
                onChange={ev => setEmail(ev.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  name="city"
                  onChange={ev => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  name="postalCode"
                  onChange={ev => setPostalCode(ev.target.value)}
                />
              </CityHolder>
              <Input
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                name="streetAddress"
                onChange={ev => setStreetAddress(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Country"
                value={country}
                name="country"
                onChange={ev => setCountry(ev.target.value)}
              />
              
          
              <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Pay'}
      </button>
            </Box>
            
            
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
};

export default CartPage;
