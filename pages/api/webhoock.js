import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (!global.mongooseConnected) {
      await mongooseConnect();
      global.mongooseConnected = true;
    }

    try {
      const { id, type } = req.body;

      if (type === 'payment' && id) {
        const order = await Order.findById(id);
        if (order) {
          order.paid = true; 
          await order.save();
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
