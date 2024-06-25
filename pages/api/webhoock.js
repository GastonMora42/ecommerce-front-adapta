import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  console.log('webhook handler invoked'); // Log inicial
  if (req.method === 'POST') {
    if (!global.mongooseConnected) {
      console.log('Connecting to MongoDB');
      await mongooseConnect();
      global.mongooseConnected = true;
      console.log('Connected to MongoDB');
    }

    try {
      const { id, type } = req.body;
      console.log('Request body:', req.body); // Log de request body

      if (type === 'payment' && id) {
        const order = await Order.findById(id);
        if (order) {
          order.paid = true; 
          await order.save();
          console.log('Order updated to paid:', order); // Log de orden actualizada
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Error handling webhook' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
