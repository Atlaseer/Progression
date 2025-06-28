import express from 'express';
import user from '../models/User.js'

const router = express.Router();

//Create new user
router.post('/', async (req, res) => {
    try{
        const username = req.body.username?.trim();
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();
        const firstName = req.body.firstName?.trim();
        const lastName = req.body.lastName?.trim();

        if(!username || !email || !password || !firstName || !lastName) {
            return res.status(400).send({ error: 'All fields are required ' })
        }

        if(!/^[a-zA-Z0-9]+$/.test(username) || username.length < 3 || username.length > 20) {
            return res.status(422).send({ error: 'Username must be between 3-20 characters and can only contain letters and numbers!' })
        }

        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            res.status(422).send({ error: 'Invalid email format' })
        }

    } catch (error) {
        res.status(500).send({ error: `Server error: ${error.message}`})
    }
})