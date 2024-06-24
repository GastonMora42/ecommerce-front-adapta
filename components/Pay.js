import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useState } from "react";
import axios from "axios";

const Pay = ({ products, cartProducts, orderData }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  // Inicializar MercadoPago SDK
  initMercadoPago('APP_USR-9072cbab-9c3f-4194-916b-75a780ca8a27', { locale: 'es-AR' });

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
