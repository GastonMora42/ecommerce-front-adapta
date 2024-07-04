import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

// Carga dinámica del componente Wallet de MercadoPago
const Wallet = dynamic(() => import('@mercadopago/sdk-react').then(mod => mod.Wallet), { ssr: false });

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

const DiscountText = styled.p`
  font-size: 0.8rem;
  text-align: center;
  color: grey;
`;

const Pay = ({ products, cartProducts, orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [buttonGenerated, setButtonGenerated] = useState(false); // Estado para controlar si se ha generado el botón de Mercado Pago
  const router = useRouter();

  useEffect(() => {
    // Inicializar MercadoPago SDK en el cliente
    const initMP = async () => {
      const { initMercadoPago } = await import('@mercadopago/sdk-react');
      initMercadoPago('APP_USR-c204ac6d-8963-4825-92c8-986e67f93b15', { locale: 'es-AR' });
    };
    initMP();
  }, []);

  // Función para crear la preferencia
  const createPreference = async () => {
    try {
      const items = products.map(product => ({
        title: product.title,
        quantity: cartProducts.filter(id => id === product._id).length,
        unit_price: product.price,
      }));

      // Crear preferencia en MercadoPago
      const response = await axios.post('/api/create-preference', { items });
      const { id } = response.data;

      // Guardar la orden en la base de datos
      await axios.post('/api/create-order', {
        line_items: items,
        ...orderData,
        paid: false, // Asume que la orden no está pagada al momento de crearla
      });

      return id;
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      throw error;
    }
  };

  // Manejar la acción de compras
  const handleBuy = async () => {
    try {
      const id = await createPreference();
      if (id) {
        setPreferenceId(id);
        setButtonGenerated(true); // Marcar que se ha generado el botón de Mercado Pago
      }
    } catch (error) {
      console.error('Error al manejar la compra:', error);
    }
  };

  useEffect(() => {
    if (!preferenceId && !buttonGenerated) {
      handleBuy();
    }
  }, [preferenceId, buttonGenerated]);

  return (
    <div>
      {!preferenceId && !buttonGenerated && (
        <StyledButton onClick={handleBuy}>Pagar con Mercado Pago</StyledButton>
      )}
      {preferenceId && (
        <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
      )}
    </div>
  );
};

export default Pay;
