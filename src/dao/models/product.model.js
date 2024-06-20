import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: Boolean,
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  thumbnails: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
productSchema.plugin(aggregatePaginate);

export default mongoose.model('products', productSchema);
