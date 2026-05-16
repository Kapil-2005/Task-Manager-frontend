const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
  const user = await User.findOne({ email: 'kapil44352005@gmail.com' });
  if (!user) return console.log('User not found');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log('TOKEN:', token);
  try {
    const res = await fetch('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users?search=mint', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
  process.exit(0);
}
test();
