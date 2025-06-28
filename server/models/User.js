import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//Schema for creating a user
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {    type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: {type: String, required: true },
    lastName: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    bio: { type: String, default: null }
        },
        { timestamps: true }
);

//Hash password before saving user to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Compare password method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//Find user by name 
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', userSchema);
export default User;
