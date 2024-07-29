import mercadopago from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect(); // Conectarse a la base de datos

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
      const preference = {
        items: items.map(item => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
        })),
        back_urls: {
          success: 'https://www.adaptalabs.com',
          failure: 'https://www.adaptalabs.com',
          pending: 'https://www.adaptalabs.com',
        },
        auto_return: 'approved',
        external_reference: order._id.toString(), // Pasar la referencia de la orden
        notification_url: 'https://adaptalabs.com/pages/api/webhoock', // URL del webhook
      };

      const response = await mercadopago.preferences.create(preference);

      if (response && response.body && response.body.id) {
        res.status(200).json({ id: response.body.id });
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
