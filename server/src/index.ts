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

const corsOptions ={
    origin: "http://localhost:3000",
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions))

const db = new Database("thrillreview.db")

app.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    db.get("SELECT * from users WHERE username = ?", [username], (err, result) => {
        if(err) {
            res.status(400).json({error: err})
        }

        if(result) {
            res.status(400).json({error: "username already used"})
            return;
        }
    })
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
            .json({auth: false, error: err});
        }

        if(result) {
            const hashed = result.hash
            bcrypt.compare(password, hashed).then((same) => {
                if(!same) {
                    res
                    .status(400)
                    .json({auth: false, error: "Wrong username and password combination!"})
                }
                else {
                    const accessToken = createTokens(result)

                    res.cookie("access-token", accessToken, {
                        maxAge: daysToMilliseconds(30),
                        httpOnly: true
                    })

                    res.json({auth: true, username: username, id: result.id})

                }

            })
        } else {
            res
            .status(400)
            .json({auth: false, message: "User does not exist"});
        }
    })


 })

 /* 
 app.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.token

    if(!refreshToken) {
        return res.status(401).json({error: "You are not authenticated"})
    }
 })
*/

 app.get('/profile', validateTokens, (req, res) => {
    const userid = (req as any).user.id
    db.get("SELECT * FROM users WHERE id = ?", [userid], (err, result) => {
        if(err) {
            return res.status(400).json({error: err})
        }
        // hier kan je informatie over de profiel sturen naar de client
        res.status(200).json({email: result.email})
    })

})

app.get('/', (req, res) => {
    res.json({"nothing": "yet"})
})

app.listen(5000, () => {console.log("server is running on port 5000")})