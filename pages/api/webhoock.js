import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import MercadoPago from 'mercadopago';
import { Order } from '@/models/Order.js';

const router = express.Router();

const secret = '9a19b941cd90dca875d7e02d234b1b90926b3d69ba4613d500d1366c10067e6c'; // Reemplaza esto con tu clave secreta de MercadoPago

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
  const headers = req.headers;
  const xSignature = headers['x-signature'];
  const xRequestId = headers['x-request-id'];

  if (!xSignature || !xRequestId) {
    return res.status(400).send('Missing headers');
  }

  const parts = xSignature.split(',');
  let ts;
  let hash;

  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === 'ts') {
        ts = trimmedValue;
      } else if (trimmedKey === 'v1') {
        hash = trimmedValue;
      }
    }
  });

  const dataId = req.body.data.id;
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const sha = hmac.digest('hex');

  if (sha !== hash) {
    return res.status(403).send('Invalid signature');
  }

  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;

    try {
      const payment = await MercadoPago.payment.findById(paymentId);

      if (payment && payment.body.external_reference) {
        const orderId = payment.body.external_reference;
        const order = await Order.findById(orderId);

        if (order) {
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
