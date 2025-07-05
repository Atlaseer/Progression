import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import brcypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';
import ip from 'ip';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import userRoutes from './routes/user.js';
import { error } from 'console';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000

const allowedOrigins = ['http://localhost', 'http://localhost:5173', 'http://localhost:3000', 'https://']

app.use(cors({
    origin: function(origin, callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        } else{
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by cors'))
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization', 'X-CSRF-Token']
}))

app.use(cookieParser());
app.use(express.json());

app.use('/api/users/', userRoutes)

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.get('/api/message', (req, res) => {
    res.json({ message: 'Message from backend'})
})

//Gets local IP address
const ipAddress = ip.address();

//Connects to database
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('Connected to MongoDB')

        app.listen(PORT, ()=>{
            console.log(`Server is running on port http://localhost:${PORT}`);
            console.log(`Server is running on port http://${ipAddress}:${PORT}`)
        })
    })
    .catch(err =>{
        console.error('Failed to connect to MongoDB', err)
    })
