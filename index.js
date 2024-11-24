import express from "express";
import mongoose from "mongoose";

import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());
// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/gym")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error: ", err);
    });

// Models

const coachSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    phone: String,
    email: String,
    image: String,
    created_at: { type: Date, default: Date.now },
});

const Coach = mongoose.model("Coach", coachSchema);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from gym app!");
});

// Coach routes

app.post("/coach", async (req, res) => {
    const { name, email, image } = req.body;

    try {
        let user = await Coach.findOne({ email });

        if (user) {
            console.log("User already exists:", email);
            return res
                .status(200)
                .send({ message: "User already exists", user });
        }

        user = await Coach.create({ name, email, image });
        console.log("New user created:", user);

        res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send({ message: "Error saving user" });
    }
});

app.get("/coach", async (req, res) => {
    const { id } = req.headers;

    if (!id) {
        res.status(400).send("Please provide id");
    }

    try {
        const coach = await Coach.findById(mongoose.Types.ObjectId(id));
        res.json({
            message: "Coach found",
            coach: coach,
        });
    } catch (err) {
        res.status(404).send("Coach not found");
    }
});

// update coach

app.put("/coach", async (req, res) => {
    const { id, name, dob, phone, email } = req.body;

    if (!id || !name || !dob || !phone || !email) {
        res.status(400).send("Please provide all fields");
    }

    try {
        const coach = await Coach.findById(mongoose.Types.ObjectId(id));
        coach.name = name;
        coach.dob = dob;
        coach.phone = phone;
        coach.email = email;

        const result = await coach.save();
        res.json({
            message: "Coach updated successfully",
            coach: result,
        });
    } catch (err) {
        res.status(404).send("Coach not found");
    }
});

// delete coach

app.delete("/coach", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).send("Please provide id");
    }

    try {
        const result = await Coach.findByIdAndDelete(
            mongoose.Types.ObjectId(id)
        );
        res.json({
            message: "Coach deleted successfully",
            coach: result,
        });
    } catch (err) {
        res.status(404).send("Coach not found");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
