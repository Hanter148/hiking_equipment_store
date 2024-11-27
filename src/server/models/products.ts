// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   imageUrl: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true }
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;

import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
}

const productSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;