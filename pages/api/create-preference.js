import { MercadoPagoConfig, Preference } from 'mercadopago';
import {mongooseConnect} from "@/lib/mongoose";
import {Order} from "@/models/Order";

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-2070490052301144-061720-329a5aec1f647459f124e5273afbfd73-1861272759' 
});

const preference = new Preference(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body;

      const preferenceBody = {
        items,
        back_urls: {
          success: 'https://www.youtube.com/@onthecode',
          failure: 'https://www.youtube.com/@onthecode',
          pending: 'https://www.youtube.com/@onthecode'
        },
        auto_return: 'approved',
      };

      const result = await preference.create({ body: preferenceBody });
      

      // Debugging the result object
      console.log('MercadoPago create response:', result);

      if (result && result.id) {
        res.status(200).json({ id: result.id });
      } else {
        throw new Error('Invalid response from MercadoPago');
      }
    } catch (error) {
      console.error('Error creating preference:', error);
      res.status(500).json({ error: 'Error al crear la preferencia' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
