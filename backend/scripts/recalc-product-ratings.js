const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const env = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hilop';
  console.log('Connecting to', env);
  await mongoose.connect(env, { useNewUrlParser: true, useUnifiedTopology: true });

  // Load models
  // Use raw collections to avoid requiring TS compiled models
  const productsColl = mongoose.connection.collection('products');
  const reviewsColl = mongoose.connection.collection('reviews');

  const products = await productsColl.find({}).toArray();
  console.log('Found', products.length, 'products');

  for (const p of products) {
    const reviews = await reviewsColl.find({ productId: p._id.toString(), isApproved: true }).toArray();
    const total = reviews.length;
    const avg = total > 0 ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / total) * 10) / 10 : 0;
    await productsColl.updateOne({ _id: p._id }, { $set: { rating: avg, reviewsCount: total } });
    console.log(`Updated ${p._id} => rating=${avg}, count=${total}`);
  }

  console.log('Done');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
