require("dotenv").config()
const express = require("express")
const session = require("express-session")
const massive = require("massive")
const authCtrl = require("./controllers/authController")
const treasureCtrl = require("./controllers/treasureController")
const auth = require("./middleware/authMiddleware")

const app = express()

const PORT = 4000

const {CONNECTION_STRING, SESSION_SECRET} = process.env

app.use(express.json())

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set("db", db)
    console.log("db is connected")
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

app.get("/auth/logout", authCtrl.logout)
app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)

app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure)
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure)

app.listen(PORT, () => console.log(`Listening up on port ${PORT}`))