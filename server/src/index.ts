import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validateTokens } from "./JWT";
import {
  ChangePassword,
  loginUser,
  registerNewUser,
  sendProfileInformation,
  updateEmail,
  updateUsername,
  addAvatar,
  getAvatar,
  updateAvatar,
  setAvatar
} from "./userManagementCallbacks";
import { addAttraction, findAttractionById, findAttractionReviews, findReview, setAttractionReview } from "./attractionCallbacks";
import multer from "multer";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("please upload an Image"));
    }
    cb(null, true);
  },
});
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

// usermanagement requests
app.post("/register", registerNewUser);
app.post("/upload-avatar", [validateTokens, upload.single("avatar")], addAvatar);
app.post("/change-avatar", [validateTokens, upload.single("avatar")], setAvatar)
app.post("/get-avatar", validateTokens, getAvatar)
app.post("/login", loginUser);
app.post("/profile", validateTokens, sendProfileInformation);
app.post("/updateUsername", validateTokens, updateUsername);
app.post("/updateEmail", validateTokens, updateEmail);
app.post("/updatePassword", validateTokens, ChangePassword);

//attrations requests
app.post("/addAttraction", validateTokens, addAttraction);
app.post("/getAttraction", findAttractionById);
app.post("/upload-review", validateTokens, setAttractionReview)
app.post("/get-review", findReview)
app.post("/get-attraction-reviews", findAttractionReviews)

app.get("/", (req, res) => {
  res.json({ "nothing": "yet" });
});

app.listen(5001, () => {
  console.log("server is running on port 5001");
});
