import MercadoPago from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import crypto from 'crypto';

// Configura MercadoPago con tu access token
const client = new MercadoPago({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect();

    try {
      // Verifica la firma del webhook
      const rawBody = JSON.stringify(req.body);
      const signature = req.headers['x-mp-signature'];
      const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(rawBody);
      const hash = hmac.digest('hex');

      if (hash !== signature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Unauthorized request' });
      }

      const { type, data } = req.body;

      if (type === 'payment') {
        const paymentId = data.id;

        // Obtener detalles del pago desde MercadoPago usando el método get
        const payment = await client.payment.get({ id: paymentId });

        if (payment && payment.body && payment.body.external_reference) {
          // Buscar la orden correspondiente en la base de datos
          const orderId = payment.body.external_reference;
          const order = await Order.findById(orderId);

          if (order) {
            // Actualizar el estado de pago de la orden
            if (payment.body.status === 'approved') {
              order.paid = true;
              await order.save();
              console.log(`Order ${orderId} updated to paid.`);
            } else {
              console.log(`Order ${orderId} not paid. Status: ${payment.body.status}`);
            }
          } else {
            console.error(`Order ${orderId} not found.`);
          }
        } else {
          console.error('Payment or external reference not found.');
        }
      } else {
        console.error('Invalid type in webhook notification.');
      }

      // Responder con 200 OK
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
    }
  } else {
    // Responder con Method Not Allowed si no es POST
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}