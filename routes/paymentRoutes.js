import express from 'express';
import MercadoPago from 'mercadopago';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

const router = express.Router();

// Configurar MercadoPago
MercadoPago.configure({
  access_token: 'APP_USR-2048944057968799-061720-e4f946a4acfbb99604e26c2ef4a8bf60-187439342'
});

router.post('/create-preference', async (req, res) => {
  await mongooseConnect();

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
      paid: false,
    });
    await order.save();

    // Crear la preferencia de MercadoPago
    const preference = {
      items,
      back_urls: {
        success: 'https://www.adaptalabs.com',
        failure: 'https://www.adaptalabs.com',
        pending: 'https://www.adaptalabs.com'
      },
      auto_return: 'approved',
      external_reference: order._id.toString(),
      notification_url: 'https://adaptalabs.com/pages/api/webhoock?source_news=webhooks', // URL del webhook
    };

    const response = await MercadoPago.preferences.create(preference);
    res.status(200).json({ id: response.body.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
});

router.post('/webhook', async (req, res) => {
    await mongooseConnect();
  
    try {
      const { type, data } = req.body;
  
      if (type === 'payment') {
        const paymentId = data.id;
  
        // Obtener detalles del pago desde MercadoPago
        const payment = await MercadoPago.payment.findById(paymentId);
  
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
  });
  
  export default router;
  
