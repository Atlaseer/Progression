import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MONGODB');

        await User.deleteMany({});

        const plainPasswords = ['Simon', 'Samuel', 'Sven', 'Test'];
        const hashedPasswords = await Promise.all(
            plainPasswords.map(pw => bcrypt.hash(pw, 10))
        );

        const users = await User.insertMany([
            { username: 'simonpersson', email: 'simon@mail.com', password:  hashedPasswords[0], firstName: 'Simon', lastName: 'Persson', isAdmin: true },
            { username: 'Samuel', email: 'samuel@mail.com', password: hashedPasswords[1], firstName: 'Samuel', lastName: 'Persson', isAdmin: false },
            { username: 'Sven', email: 'sven@mail.com', password: hashedPasswords[2], firstName: 'Sven', lastName: 'Svensson', isAdmin: true },
            { username: 'Test', email: 'test@mail.com', password: hashedPasswords[3], firstName: 'Test', lastName: 'Testsson', isAdmin: true },
        ]);

        console.log(`${users.length} users successfully isnerted` );
        process.exit();

    } catch (err) {
        console.log("Error seeding data: ", err);
        process.exit(1);
    } finally {
        await mongoose.disconnect(); 
    }
}

seed();
