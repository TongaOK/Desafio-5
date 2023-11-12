import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: Number,
  stock: Number,
}, { timestamps: true });

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductSchema);
