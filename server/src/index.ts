import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validateTokens } from "./JWT";
import {
  ChangePassword,
  loginUser,
  logoutUser,
  registerNewUser,
  sendProfileInformation,
  updateEmail,
  updateUsername,
  addAvatar,
  getAvatar,
  updateAvatar,
  setAvatar,
  getUserName,
  deleteUser
} from "./userManagementCallbacks";
import { addAttraction, findAttractionById, findAttractionByName, findAttractionReviews, findReview, getAttractionName, getAverageRating, setAttractionReview, updateAttraction, addAttractionPhotos, getAttractionPhoto } from "./attractionCallbacks";
import { addThemePark, editThemePark, findThemeParkByID, findThemeParkByName } from "./themeParkCallbacks";
import multer from "multer";
import {getRecentAttractions, getRecentReviews, getRecents, getRecentThemeparks} from "./home";
import Review from "./Review";
import { sendFeeds } from "./feedsCallbacks";

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
app.post("/user", registerNewUser);
app.post("/user/login", loginUser);
app.delete("/user/logout", logoutUser);
app.get("/user/email", validateTokens, sendProfileInformation);
app.get("/user/:id/username", getUserName)

app.post("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar);
app.put("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar)
app.get("/user/:id/avatar", getAvatar)

app.put("/user/username", validateTokens, updateUsername);
app.put("/user/email", validateTokens, updateEmail);
app.put("/user/password", validateTokens, ChangePassword);
app.delete("/user", validateTokens, deleteUser)

//attrations requests
app.post("/attraction", validateTokens, addAttraction);
app.post("/attraction/:attractionID/photos", [validateTokens, upload.single("image")], addAttractionPhotos);
app.put("/attraction/:attractionID", validateTokens, updateAttraction);
app.get("/attraction/:attractionID", findAttractionById);
app.post("/attraction/:attractionID/review", validateTokens, setAttractionReview)
app.put("/attraction/:attractionID/review", validateTokens, setAttractionReview)
app.get("/attraction/:attractionID/review", findReview)
app.get("/attraction/:attractionID/reviews", findAttractionReviews)
app.get("/attraction/:attractionID/rating", getAverageRating)
app.get("/attraction/:attractionID/name", getAttractionName)
app.get("/attractions/find", findAttractionByName)
app.get("/attractions/:attractionID/photos", getAttractionPhoto)


//themepark requests
app.post("/themepark", validateTokens, addThemePark)
app.get("/themepark/:themeparkID", findThemeParkByID)
app.put("/themepark/:themeparkID", validateTokens, editThemePark)
app.get("/themeparks/find", findThemeParkByName)

app.get("/feed", sendFeeds);

app.listen(5001, () => {
  console.log("server is running on port 5001");
});
