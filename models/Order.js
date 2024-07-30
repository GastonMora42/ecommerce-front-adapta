import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  line_items: [{
    title: String,
    quantity: Number,
    unit_price: Number,
  }],
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  paid: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);
