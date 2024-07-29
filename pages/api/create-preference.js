import MercadoPago from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

// Configura MercadoPago con tu access token
const client = new MercadoPago({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const preference = new MercadoPago.Preference(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect(); // Conectar a la base de datos

    try {
      const { items, name, email, city, postalCode, streetAddress, country } = req.body;

      // Crear la orden en la base de datos
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
          success: 'https://www.adaptalabs.com',
          failure: 'https://www.adaptalabs.com',
          pending: 'https://www.adaptalabs.com'
        },
        auto_return: 'approved',
        external_reference: order._id.toString(), // Pasar la referencia de la orden
        notification_url: 'https://adaptalabs.com/pages/api/webhoock', // URL del webhook
      };

      const result = await preference.create({ body: preferenceBody });

      // Depurar el objeto de respuesta
      console.log('MercadoPago create response:', result);

      if (result && result.body.id) {
        res.status(200).json({ id: result.body.id });
      } else {
        throw new Error('Invalid response from MercadoPago');
      }
    } catch (error) {
      console.error('Error creating preference:', error);
      res.status(500).json({ error: 'Error al crear la preferencia' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
