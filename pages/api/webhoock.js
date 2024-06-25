export const config = {
  runtime: 'edge',
};

import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req) {
  if (req.method === 'POST') {
    await mongooseConnect(); // Conectarse a la base de datos

    try {
      const { id, status } = await req.json();

      // Buscar la orden y actualizar su estado
      const order = await Order.findOne({ _id: id });

      if (order) {
        order.paid = status === 'approved';
        await order.save();
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return new Response(JSON.stringify({ error: 'Error handling webhook' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
