const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://https://task-manager-backend-production-d7b3.up.railway.app:27017/ethara');
  const user = await User.findOne({ email: 'kapil4343@gmail.com' });
  if (!user) return console.log('User not found');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  console.log('TOKEN=', token);
  process.exit(0);
}
test();
