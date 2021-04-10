
import mongoose from 'mongoose';
const { Schema } = mongoose;

const casheSchema = new Schema({
  key: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('Cashe', casheSchema);
