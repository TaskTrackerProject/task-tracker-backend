const dotenv = require("dotenv")
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const userRoutes = require("./routes/UserRoutes")
const path = require("path");

const app = express()

//Middle Ware
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config({ path: path.resolve(__dirname, '.env') });

//Routes
app.use("/api/user", userRoutes)

//Connection
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("MONGO DB connected successfully!")
    app.listen(PORT, () => {
        console.log("Listening on port: ", PORT)
    })
}).catch((err) => {
    console.log(err)
});