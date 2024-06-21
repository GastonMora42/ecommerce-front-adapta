import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useState } from "react";
import axios from "axios";

const Pay = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  // Inicializar MercadoPago SDK
  initMercadoPago('APP_USR-9072cbab-9c3f-4194-916b-75a780ca8a27', { locale: 'es-AR' });

  // Función para crear la preferencia
  const createPreference = async () => {
    try {
      const response = await axios.post('/api/create-preference', {
        items: [
          {
            title: 'Hongo recontra flipadisimo tio',
            quantity: 1,
            unit_price: 149000,
          }
        ]
      });

      const { id } = response.data;
      return id;
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      throw error; // Propaga el error para manejarlo en un nivel superior si es necesario
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
      // Aquí puedes manejar el error según tus necesidades
    }
  };

  return (
    <div>
      <button onClick={handleBuy}>Comprar</button>
      <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
    </div>
  );
};

export default Pay;
