import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Pay from "@/components/Pay";
import { useRouter } from "next/router";
import Footer from "@/components/Footer"; // Importamos el Footer



const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const InfoContainer = styled.div`
  background-color: #f8f9fa; // Fondo gris claro
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Sombra sutil
  margin: 20px 0;
`;

const DiscountText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  color: grey;
`;

// Define los párrafos estilizados
const InfoText = styled.p`
  color: #333; // Texto en gris oscuro
  font-size: 1rem;
  line-height: 1.5;
  margin: 10px 0;
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

const StyledButton = styled.button`
border-radius: 10px;
background-color: #00aaff; /* Azul */
color: white;
text-align: center;
padding: 10px 20px;
border: 1px solid #0077cc;
cursor: pointer;
margin-top: 15px;
display: block;
margin-left: auto;
margin-right: auto;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      clearCart();
      setIsFormComplete(false); // Resetear el estado del formulario
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  function validateFields() {
    return name && email && city && postalCode && streetAddress && country && cartProducts.length > 0;
  }

  function handleBuyClick(paymentMethod) {
    if (!validateFields()) {
      alert("Tienes que llenar todos los campos y seleccionar productos");
    } else {
      if (paymentMethod === 'mercadoPago') {
        // Lógica para Mercado Pago (si es necesario)
        // Puedes llamar a una función o componente para generar la preferencia y luego redireccionar
        // Ejemplo (suponiendo que Pay genera la preferencia):
        setIsFormComplete(true);
      } else if (paymentMethod === 'transferenciaBancaria') {
        router.push({
          pathname: '/transferencia-instrucciones',
          query: {
            products: JSON.stringify(products),
            name,
            email,
            city,
            postalCode,
            streetAddress,
            country,
            total // Asegúrate de pasar el total correctamente
          }
        });
      }
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    total += price;
  }

  const orderData = {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country
  };

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Carrito</h2>
            {!cartProducts?.length && (
              <div>Tu carrito está vacío</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Productos</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                      </td>
                      <td>
                        ${cartProducts.filter(id => id === product._id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Información del pedido</h2>
              <Input type="text"
                     placeholder="Nombre y Apellido"
                     value={name}
                     name="name"
                     onChange={ev => setName(ev.target.value)}
                     required />
              <Input type="text"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={ev => setEmail(ev.target.value)}
                     required />
              <CityHolder>
                <Input type="text"
                       placeholder="Ciudad"
                       value={city}
                       name="city"
                       onChange={ev => setCity(ev.target.value)}
                       required />
                <Input type="text"
                       placeholder="Código postal"
                       value={postalCode}
                       name="postalCode"
                       onChange={ev => setPostalCode(ev.target.value)}
                       required />
              </CityHolder>
              <Input type="text"
                     placeholder="Calle"
                     value={streetAddress}
                     name="streetAddress"
                     onChange={ev => setStreetAddress(ev.target.value)}
                     required />
              <Input type="text"
                     placeholder="País"
                     value={country}
                     name="country"
                     onChange={ev => setCountry(ev.target.value)}
                     required />

              {isFormComplete ? (
                <Pay products={products} cartProducts={cartProducts} orderData={orderData} />
              ) : (
                <>
                  <StyledButton onClick={() => handleBuyClick('mercadoPago')}>Pagar con Mercado Pago</StyledButton>
                  <StyledButton onClick={() => handleBuyClick('transferenciaBancaria')}>Pagar por Transferencia Bancaria</StyledButton>
                  <DiscountText>10% de descuento</DiscountText>
                </>
              )}

              <InfoContainer>
                <InfoText>Envío a acordar una vez realizada la compra vía Whatsapp:</InfoText>
                <InfoText>Cel: +54 9 2993 28-9265</InfoText>
              </InfoContainer>

            </Box>
          )}
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}
