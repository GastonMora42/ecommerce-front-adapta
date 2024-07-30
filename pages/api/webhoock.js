import express from 'express';
import mongoose from 'mongoose';
import MercadoPago from 'mercadopago';
import { Order } from '@/models/Order';

const router = express.Router();

MercadoPago.configure({
  access_token: 'APP_USR-2048944057968799-061720-e4f946a4acfbb99604e26c2ef4a8bf60-187439342'
});

// Conectar a MongoDB
mongoose.connect('MONGODB_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

router.post('/webhoock', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;

    try {
      // Obtener detalles del pago desde MercadoPago
      const payment = await MercadoPago.payment.findById(paymentId);

      if (payment && payment.body.external_reference) {
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

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
    }
  } else {
    res.status(400).send('Event type not supported');
  }
});

export default router;
