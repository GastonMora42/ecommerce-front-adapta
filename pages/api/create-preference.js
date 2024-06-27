import { MercadoPagoConfig, Preference } from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-2070490052301144-061720-329a5aec1f647459f124e5273afbfd73-1861272759'
});

const preference = new Preference(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect(); // Conectarse a la base de datoss

    try {
      const { items, name, email, city, postalCode, streetAddress, country } = req.body;

      // Crear la orden en la base de datoss
      const order = new Order({
        line_items: items,
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid: false, // Inicialmente no está pagada
      });
      await order.save();

      // Crear la preferencia de MercadoPago
      const preferenceBody = {
        items,
        back_urls: {
          success: 'https://www.youtube.com/@onthecode',
          failure: 'https://www.youtube.com/@onthecode',
          pending: 'https://www.youtube.com/@onthecode'
        },
        auto_return: 'approved',
        external_reference: order._id.toString(), // Pasar la referencia de la orden
        notification_url: 'https://yourdomain.com/api/webhook', // URL del webhook
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
n