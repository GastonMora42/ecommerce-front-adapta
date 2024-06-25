import { MercadoPagoConfig, Preference } from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

// Configurar MercadoPago usando una variable de entorno para la clave de acceso
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Conectarse a la base de datos una vez al inicio
    if (!global.mongooseConnected) {
      await mongooseConnect();
      global.mongooseConnected = true;
    }

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
          success: 'https://www.youtube.com/@onthecode',
          failure: 'https://www.youtube.com/@onthecode',
          pending: 'https://www.youtube.com/@onthecode'
        },
        auto_return: 'approved',
        external_reference: order._id.toString(), // Pasar la referencia de la orden
        notification_url: 'https://adaptalabs/api/webhook', // URL del webhook
      };

      const result = await preference.create({ body: preferenceBody });

      // Verificar y responder con el ID de la preferencia creada
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
