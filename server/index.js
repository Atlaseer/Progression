import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import ip from 'ip';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000

const allowedOrigins = ['http://localhost', 'http://localhost:5173', 'http://localhost:3000', 'https://']