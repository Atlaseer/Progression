import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        
    } catch (err) {
        console.log("Error seeding data: ", err);
        process.exit(1);
    }
}