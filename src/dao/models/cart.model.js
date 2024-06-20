import mongoose from "mongoose";

const productSubSchema = new mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  }
}, {_id: false});

const cartSchema = new mongoose.Schema({
  products: [productSubSchema]
});

export default mongoose.model('carts', cartSchema);
