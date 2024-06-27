import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Carga dinámica del componente Wallet de MercadoPago
const Wallet = dynamic(() => import('@mercadopago/sdk-react').then(mod => mod.Wallet), { ssr: false });

const Pay = ({ products, cartProducts, orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);

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

  // Manejar la acción de compra
  const handleBuy = async () => {
    try {
      const id = await createPreference();
      if (id) {
        setPreferenceId(id);
      }
    } catch (error) {
      console.error('Error al manejar la compra:', error);
    }
  };

  return (
    <div>
      <button onClick={handleBuy}>Comprar</button>
      {preferenceId && (
        <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
      )}
    </div>
  );
};

export default Pay;
