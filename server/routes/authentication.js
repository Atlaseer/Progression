import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../models/User.js';
import dotenv from 'dotenv';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //Validates username and password
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' })
    }

    //Finds user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    //Verifies password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' })

    //If JWT_SECRET isn´t set, run generateJWT_SECRET once to get a code for it 
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        admin: user.isAdmin,
        active: user.isActive,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h'}
    )

    //Secure = true if https, token lasts 1h
    res.cookie('token', token), {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1000*60*60
    }

    res.json({ message: 'Login successful', token, user: {username: user.username, id: user._id, admin: user.admin, active: user.isActive}});
} )

//Extrapolate user data from token
router.get('/me', (req, res) => {
    
})