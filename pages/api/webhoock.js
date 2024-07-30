import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await mongooseConnect();

    const { type, data } = req.body;

    try {
      if (type === 'payment') {
        const paymentId = data.id;

        // Obtener detalles del pago desde MercadoPago
        const payment = await client.payment.get(paymentId);

        if (payment && payment.external_reference) {
          // Buscar la orden correspondiente en la base de datos
          const orderId = payment.external_reference;
          const order = await Order.findById(orderId);

          if (order) {
            // Actualizar el estado de pago de la orden
            if (payment.status === 'approved') {
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
