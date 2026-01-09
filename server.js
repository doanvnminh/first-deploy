
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://doanvnminh160_db_user:n3M29raaeOwLUDKR@cluster0.m1f28xt.mongodb.net/?appName=Cluster0"
mongoose.connect(uri).then(() => console.log("Connected to MongoDB Atlas(Cloud)")).catch(err => console.log("Cannot connect to MongoDB Atlas", err));

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }
    //password_hash: { type: String, required: true },
    //created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


//const bodyParser = require('body-parser');

//const User = require('./models/User');


app.post('/register', async (req, res) => {
    console.log("Received Data:", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }
    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            //console.log("Error: User already exists"); // Log this
            return res.status(400).json({ message: "User already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        //console.log("Success: User created"); // Log success
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        //console.error("Server Error:", error);
        res.status(500).json({ message: "Error" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    //console.log(`--- Login Attempt for: ${username} ---`);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            //console.log("❌ Result: User not found in database");
            return res.status(400).json({ message: "User not found" });
        }
        //console.log("✅ User found in DB");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            //console.log("❌ Result: Password does not match");
            return res.status(400).json({ message: "Wrong password" });
        }
        //console.log("✅ Password matches! Login successful.");
        res.status(200).json({ message: "Login Successful", username: user.username });
    }
    catch (error) {
        //console.error("Server Error during login:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

