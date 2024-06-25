import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Usar variables de entorno
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
          pending: 'https://www.youtube.com/@onthecode',
        },
        auto_return: 'approved',
      };

      const result = await preference.create({ body: preferenceBody });

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
