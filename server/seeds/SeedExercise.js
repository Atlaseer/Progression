import mongoose from 'mongoose';
import Exercise from '../models/Exercise.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB')

        await Exercise.deleteMany();

        const exercises = await Exercise.insertMany([
            {   name: 'Dumbbell bench press', 
                muscleGroup: ['Chest', 'Triceps'], 
                equipment: 'Dumbbell', 
                description:'Lay on a bench and press the dumbbells above you' 
            },
            {   name: 'Machine row', 
                muscleGroup: ['Back', 'Biceps', 'Lats'], 
                equipment: 'Machine', 
                description: 'Pull the bar towards your chest, then slowly let the bar back' 
            },
            {   name: 'Dumbbell biceps curl', 
                muscleGroup: ['Biceps'], 
                equipment: 'Dumbbell', 
                description: 'Isolation exercise for biceps' 
            },
            {   name: 'Dumbbell shoulder press', 
                muscleGroup: ['Shoulders', 'Triceps'], 
                equipment: 'Dumbbell', 
                description: 'Targets deltoids using overhead press'
            },
            {   name: 'Squat', 
                muscleGroup: ['Legs', 'Glutes', 'Hamstring', 'Butt', 'Quads'], 
                equipment: 'Barbell', 
                description: 'Compound exercise for lower body strength' 
            }
        ])

        console.log(`${exercises.length} Exercises successfully inserted`);
        process.exit();

    } catch (err) {
        console.log("Error seeding data: ", err);
    } finally {
        await mongoose.disconnect();
        process.exit(1);

    }
}

seed();
