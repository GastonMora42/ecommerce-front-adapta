import mercadopago from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect();

    const { type, data } = req.body;
g
    try {
      if (type === 'payment') {
        const paymentId = data.id;

        // Obtener detalles del pago desde MercadoPagos
        const response = await mercadopago.payment.get(paymentId);

        if (response && response.body && response.body.external_reference) {
          // Buscar la orden correspondiente en la base de datos
          const orderId = response.body.external_reference;
          const order = await Order.findById(orderId);

          if (order) {
            // Actualizar el estado de pago de la orden
            if (response.body.status === 'approved') {
              order.paid = true;
              await order.save();
            }
          }
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}