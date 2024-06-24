import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'POST') {
    try {
      const orderData = req.body;
      const order = new Order(orderData);
      await order.save();
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
