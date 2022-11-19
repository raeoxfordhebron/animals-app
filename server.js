// Dependencies
require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const PORT = process.env.PORT

const app = express()

// Database Connection
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connnection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))

// Animals Models
const {Schema, model} = mongoose

const animalSchema = new Schema ({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number,
})

// make animal model
const Animal = model("Animals", animalSchema)


// Routes
app.get("/", (req, res) => {
    res.send(`server is running`)
})
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})