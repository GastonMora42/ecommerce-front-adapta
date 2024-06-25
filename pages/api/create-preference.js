import { MercadoPagoConfig, Preference } from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

export default async function handler(req, res) {
  console.log('create-preference handler invoked'); // Log inicial
  if (req.method === 'POST') {
    if (!global.mongooseConnected) {
      console.log('Connecting to MongoDB');
      await mongooseConnect();
      global.mongooseConnected = true;
      console.log('Connected to MongoDB');
    }

    try {
      const { items, name, email, city, postalCode, streetAddress, country } = req.body;
      console.log('Request body:', req.body); // Log de request body

      const order = new Order({
        line_items: items,
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid: false,
      });
      await order.save();
      console.log('Order saved:', order); // Log de orden guardada

      const preferenceBody = {
        items,
        back_urls: {
          success: 'https://www.youtube.com/@onthecode',
          failure: 'https://www.youtube.com/@onthecode',
          pending: 'https://www.youtube.com/@onthecode'
        },
        auto_return: 'approved',
        external_reference: order._id.toString(),
        notification_url: 'https://adaptalabs.com/api/webhook',
      };

      const result = await preference.create({ body: preferenceBody });
      console.log('MercadoPago create response:', result); // Log de respuesta de MercadoPago

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

