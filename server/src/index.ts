import express from 'express'
import sqlite, { Database } from 'sqlite3'
import cors from "cors"
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import {createTokens, validateTokens} from './JWT'
import {daysToMilliseconds} from './helpers'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

const db = new Database("thrillreview.db")

app.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    // hashing factor = 15
    bcrypt.hash(password, 15).then((hash) => {
        db.run("INSERT INTO users (username, email, hash) VALUES(? , ?, ?)", [username, email, hash],  (error: Error) => {
            if(error)
                return res.status(400).json({error: error});

            res.json("USER REGISTERED")})
    })

})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if(err) {
            res
            .status(400)
            .json({error: err});
        }

        if(result) {
            const hashed = result.hash
            bcrypt.compare(password, hashed).then((same) => {
                if(!same) {
                    res
                    .status(400)
                    .json({error: "Wrong username and password combination!"})
                }
                else {
                    const accessToken = createTokens(result)

                    res.cookie("access-token", accessToken, {
                        maxAge: daysToMilliseconds(30),
                        httpOnly: true
                    })

                    res.json("LOGGED IN")

                }

            })
        } else {
            res
            .status(400)
            .json({message: "User does not exist"});
        }
    })


 })

 app.get('/profile', validateTokens, (req, res) => {
    res.json("profile")
 })

app.get('/', (req, res) => {
    res.json({"nothing": "yet"})
})

app.listen(5000, () => {console.log("server is running on port 5000")})