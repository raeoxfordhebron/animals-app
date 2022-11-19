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

// Middleware
app.use(morgan("tiny"))
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))

// Routes
app.get("/", (req, res) => {
    res.send(`server is running`)
})

app.get("/animals/seed", (req, res) => {
    const startAnimals = [
        {species: "Tiger", extinct: false, location: "Asia", lifeExpectancy: 15},
        {species: "Bonobo", extinct: false, location: "America", lifeExpectancy: 12},
        {species: "Green Sea Turtle", extinct: false, location: "Ocean", lifeExpectancy: 8},
        {species: "Tasmanian Tiger", extinct: true, location: "Tasmania", lifeExpectancy: 0},
        {species: "Saola", extinct: true, location: "Somewhere", lifeExpectancy: 0}
    ]
    Animal.deleteMany({}, (err, data) => {
        Animal.create(startAnimals, (err, createdAnimals) => {
            res.json(createdAnimals);
        })
    })
})

// Index Route
app.get("/animals", (req, res) => {
    Animal.find({})
    .then((animals) => {
        res.render("animals/index.ejs", {animals})
    })
})

// New Route
app.get("/animals/new", (req, res) => {
    res.render("animals/new.ejs")
})

// Delete Route
app.delete("/animals/:id", (req, res) => {
    const id = req.params.id
    Animal.findByIdAndRemove(id, (err, animal) => {
        res.redirect("/animals")
    })
})

// Update Route
app.put("/animals/:id", (req, res) => {
    const id = req.params.id
    req.body.extinct = req.body.extinct === "on" ? true : false
    Animal.findByIdAndUpdate(id, req.body, {new: true}, (err, animal) => {
        res.redirect("/animals")
    })
})

// Create Route
app.post("/animals", (req, res) => {
    console.log(req.body)
    req.body.extinct = req.body.extinct === "on" ? true : false
    Animal.create(req.body, (err, animal) => {
        res.redirect("/animals")
    })
})

// Edit Route
app.get("/animals/:id/edit", (req, res) => {
    const id = req.params.id
    Animal.findById(id, (err, animal) => {
        res.render("animals/edit.ejs", {animal})
    })
})

// Show Route
app.get("/animals/:id", (req, res) => {
    id = req.params.id
    Animal.findById(id, (err, animal) => {
        res.render("animals/show.ejs", {animal})
    })
})

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})