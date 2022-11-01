import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {validateTokens } from "./JWT";
import {registerNewUser, updateEmail, updateUsername, sendProfileInformation, loginUser, ChangePassword} from './userManagementCallbacks';

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

/*
 app.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.token

    if(!refreshToken) {
        return res.status(401).json({error: "You are not authenticated"})
    }
 })
*/

app.post("/register", registerNewUser);
app.post("/login", loginUser);
app.post("/profile", validateTokens, sendProfileInformation);
app.post("/updateUsername", validateTokens, updateUsername);
app.post("/updateEmail", validateTokens, updateEmail);
app.post("/updatePassword", validateTokens, ChangePassword)

app.get("/", (req, res) => {
  res.json({ "nothing": "yet" });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
