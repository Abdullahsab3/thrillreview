import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validateTokens } from "./JWT";
import {
  ChangePassword,
  loginUser,
  logoutUser,
  registerNewUser,
  getEmail,
  updateEmail,
  updateUsername,
  addAvatar,
  getAvatar,
  updateAvatar,
  setAvatar,
  getUserName,
  deleteUser
} from "./userManagementCallbacks";
import { addAttraction, findAttractionById, findAttractionByName, findAttractionReviews, findReview, getAttractionName, getAverageRating, setAttractionReview, updateAttraction, addAttractionPhotos, getAttractionPhoto, getAttractionPhotosCount } from "./attractionCallbacks";
import { addThemePark, editThemePark, findThemeParkByID, findThemeParkByName } from "./themeParkCallbacks";
import multer from "multer";
import { sendFeeds } from "./feedsCallbacks";
import { addEvent, findEvents, findEventUsers, findUserJoinedEvents, userJoinedEvent, eventAttendeesCount, userJoinEvent } from "./eventCallbacks";


/* 
  Setting the server environment up
*/
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



// usermanagement requests

/* 
  Registers a new user given the username, email address and password
*/
app.post("/user", registerNewUser);
app.post("/user/login", loginUser); // logs de user in (first check on password) retturns acces-token (15 min valid) & refreschtoken (1d valid) ook  returnt het user for local storage
app.delete("/user/logout", logoutUser); //logs de user uit, verwijderd acces and refreshtoken en devalidates de refreshtoken door hem te verwijderen uit de db

app.get("/user/email", validateTokens, getEmail);
app.get("/user/:id/username", getUserName)

app.post("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar);
app.put("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar)
app.get("/user/:id/avatar", getAvatar)

app.put("/user/username", validateTokens, updateUsername);
app.put("/user/email", validateTokens, updateEmail);
app.put("/user/password", validateTokens, ChangePassword);
app.delete("/user", validateTokens, deleteUser)

//attrations requests
app.post("/attraction", validateTokens, addAttraction); // basic add van een attractie
app.post("/attraction/:attractionID/photos", [validateTokens, upload.single("image")], addAttractionPhotos); // upload een afbeelding van een attracttie en sla op in db
app.put("/attraction/:attractionID", validateTokens, updateAttraction);
app.get("/attraction/:attractionID", findAttractionById);  // geeft alle informatie van een attractie terug
app.post("/attraction/:attractionID/review", validateTokens, setAttractionReview)
app.put("/attraction/:attractionID/review", validateTokens, setAttractionReview)
app.get("/attraction/:attractionID/review", findReview)
app.get("/attraction/:attractionID/reviews", findAttractionReviews)
app.get("/attraction/:attractionID/rating", getAverageRating)
app.get("/attraction/:attractionID/name", getAttractionName)
app.get("/attractions/find", findAttractionByName) //search voor alle bestaande attractties query is op naam ?query=&limit=&page= allemaal optioneel
app.get("/attractions/:attractionID/photos", getAttractionPhoto)
app.get("/attractions/:attractionID/photos/count", getAttractionPhotosCount)


//themepark requests
app.post("/themepark", validateTokens, addThemePark) //basic toevoegen van een themepark
app.get("/themepark/:themeparkID", findThemeParkByID) //geeft alle informatie terug van een pretpark
app.put("/themepark/:themeparkID", validateTokens, editThemePark)
app.get("/themeparks/find", findThemeParkByName) //search voor alle bestaande pretparken query is op naam ?query=&limit=&page= allemaal optioneel

//event requests
app.post("/event", validateTokens, addEvent) //basic event toevoegen zoals attracties toevoegen
app.get("/event/:eventID", findAttractionById) //basic event informatie krijgen zoals get attraction
app.get("/events/find", findEvents) //search voor alle bestaande events zoals de find van attracties ?query=&limit=&page= allemaal optioneel
app.post("/event/:eventID/join", validateTokens, userJoinEvent) //laat een user een event joinen geen body of query params nodig
app.get("/event/:eventID/userjoined", validateTokens, userJoinedEvent) // checked of een user deel neemt aan een bepaald event geen body of query nodig, geeft result: true terug als deelneemt of false indien niet
app.get("/event/:eventID/attendees", validateTokens, findEventUsers) // geeft een lijst van attendees mee (kan enkel door de user die het event aanmaakte opgevraagd worden) met pagination ?limit=&page=?
app.get("/event/:eventID/attendees/count", eventAttendeesCount) // geeft het aantal deelnemers van een event terug bv result: 13
app.get("/event/userJoined", validateTokens, findUserJoinedEvents) // geeft een lijst van events mee waar een user aan deel neemt met pagination ?limit=&page=


//feed requests
app.get("/feed", sendFeeds);

const port = 5001
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
