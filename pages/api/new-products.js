// pages/api/new-products.js
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 }).lean();
  res.status(200).json(newProducts);
}
