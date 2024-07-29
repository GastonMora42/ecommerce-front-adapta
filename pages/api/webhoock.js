import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import MercadoPago from "mercadopago";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect();

    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-mp-signature'];
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const hash = hmac.digest('hex');

    if (hash !== signature) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    const { type, data } = req.body;

    try {
      if (type === 'payment') {
        const paymentId = data.id;

        // Inicializa MercadoPago con tu access token
        MercadoPago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN);
        
        // Obtener detalles del pago desde MercadoPago
        const payment = await MercadoPago.payment.findById(paymentId);

        if (payment && payment.body.external_reference) {
          // Buscar la orden correspondiente en la base de datos
          const orderId = payment.body.external_reference;
          const order = await Order.findById(orderId);

          if (order) {
            // Actualizar el estado de pago de la orden
            if (payment.body.status === 'approved') {
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
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}