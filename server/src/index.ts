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
  deleteUser,
  checkIfAvatarExists
} from "./userManagementCallbacks";
import { addAttraction, findAttractionById, findAttractionByName, findAttractionReviews, findReview, getAttractionName, getAverageRating, setAttractionReview, updateAttraction, addAttractionPhotos, getAttractionPhoto, getAttractionPhotosCount } from "./attractionCallbacks";
import { addThemePark, editThemePark, findThemeParkByID, findThemeParkByName } from "./themeParkCallbacks";
import multer from "multer";
import { sendFeeds } from "./feedsCallbacks";
import { addEvent, findEvents, findEventByID, findEventUsers, findUserJoinedEvents, userJoinedEvent, eventAttendeesCount, userJoinEvent } from "./eventCallbacks";


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

/**
 * @api {get} /user/:id/username Request a username given the id of the user.
 * @apiName GetUserName
 * @apiGroup User
 * 
 * @apiParam {Number} id the unique id of the user
 * 
 * @apiSuccess (Success 200) {String} username The username
 * 
 * @apiError (Error 404) {String} username Username is not found in the database.
 * @apiError (Error 500) {String} username The server encountered an internal error while fetching the username.
 */
app.get("/user/:id/username", getUserName)

app.post("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar)
app.put("/user/avatar", [validateTokens, upload.single("avatar")], setAvatar)

/**
 * @api {get} /user/:id/avatar Get the avatar (profile picture) of a user
 * @apiName GetUserAvatar
 * @apiGroup User
 * 
 * @apiParam {Number} id The unique id of the user
 * 
 * @apiSuccess (Success 200) {png|jpg|jpeg} avatar The user avatar
 * 
 * @apiError (Error 404) {String} error The avatar is not found in the database.
 * @apiError (Error 500) {String} error The server encountered an internal error while fetching the avatar.
 */
app.get("/user/:id/avatar", getAvatar)
app.get("/user/:id/avatar/exists", checkIfAvatarExists)

app.put("/user/username", validateTokens, updateUsername);
app.put("/user/email", validateTokens, updateEmail);
app.put("/user/password", validateTokens, ChangePassword);
app.delete("/user", validateTokens, deleteUser)

//attrations requests
app.post("/attraction", validateTokens, addAttraction); // basic add van een attractie
app.post("/attraction/:attractionID/photos", [validateTokens, upload.single("image")], addAttractionPhotos); // upload een afbeelding van een attracttie en sla op in db
app.put("/attraction/:attractionID", validateTokens, updateAttraction);
/**
 * @api {get} /attraction/:attractionID Get the information of the attraction
 * @apiName GetAttraction
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * 
 * @apiSuccess (Success 200) {String} opening
 * @apiSuccess (Success 200) {String} builder
 * @apiSuccess (Success 200) {String} type
 * @apiSuccess (Success 200) {String} height
 * @apiSuccess (Success 200) {String} length
 * @apiSuccess (Success 200) {String} inversions
 * @apiSuccess (Success 200) {String} duration
 * @apiSuccess (Success 200) {String} id The id of the attraction in the database
 * 
 * @apiError (Error 404) {String} No attraction found with the given ID.
 * @apiError (Error 500) {String} error The server encountered an internal error while fetching the attraction.
 */
app.get("/attraction/:attractionID", findAttractionById);
app.post("/attraction/:attractionID/review", validateTokens, setAttractionReview)
app.put("/attraction/:attractionID/review", validateTokens, setAttractionReview)

/**
 * @api {get} /attraction/:attractionID/review Get a users review of an attratcion
 * @apiName GetReview
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID the unique id of the attraction
 * @apiQuery {Number} userid The id of the user who placed the review
 *  
 * @apiSuccess (Success 200) {string} review The review text
 * @apiSuccess (Success 200) {Number} rating The rating that the user gave to the attraction
 * @apiSuccess (Success 200) {String} date The date this review was placed/modified
 * 
 * @apiError (Error 404) {String} review The review was not found
 * @apiError (Error 500) {String} error The server encountered an error while fetching the reviw
 */
app.get("/attraction/:attractionID/review", findReview)

/**
 * @api {get} /attraction/:attractionID/reviews Get the reviews of an attraction
 * @apiName GetReviews
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * @apiQuery {Number} page The reviews page
 * @apiQuery {Number} limit How many reviews in a page
 * @apiQuery {String} orderBy How to order the reviews (by date or stars)
 * @apiQuery {String} sort How to sort the reviews (asc or desc)
 * 
 * @apiSuccess (Success 200) {Object[]} reviews An array containing all the reviews
 * @apiSuccess (Success 200) {Object} The number and limit of the next page
 * @apiSuccess (Success 200) {Object} previous The number and limit of the previous page
 * 
 * @apiError (Error 404) {String} reviews No reviews found
 * @apiError (Error 500) {String} error The server encountered an error while fecthing the reviews.
 */
app.get("/attraction/:attractionID/reviews", findAttractionReviews)

/**
 * @api {get} /attraction/:attractionID/rating Get the average rating and the number of ratings of an attraction
 * @apiName GetAverageRating
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * 
 * @apiSuccess (Success 200) {Number} rating The average rating of the attraction
 * @apiSuccess (Success 200) {Number} ratingCount The total number of ratings on this attraction
 * 
 * @apiError (Error 500) {String} error The server encountered an error while trying to get the ratings
 * @apiError (Error 400) {String} attractionID The attraction id was not correctly provided.
 */
app.get("/attraction/:attractionID/rating", getAverageRating)

/**
 * @api {get} /attraction/:attractionID/name Get the name of an attraction
 * @apiName GetAttractionName
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * 
 * @apiSuccess (Success 200) {String} name The name of the attraction
 * 
 * @apiError (Error 400) {String} attractionID The attraction id was not correctly provided
 * @apiError (Error 404) {String} error The attraction was not found
 * 
 */
app.get("/attraction/:attractionID/name", getAttractionName)
app.get("/attractions/find", findAttractionByName) //search voor alle bestaande attractties query is op naam ?query=&limit=&page= allemaal optioneel
/**
 * @api {get} /attractions/:attractionID/photos Get a photo of an attraction
 * @apiName GetAttractionPhoto
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * 
 * @apiQuery {Number} id The id of the photo
 * 
 * @apiSuccess (Success 200) {png/jpg/jpeg} photo The photo of the attraction with the given index
 * 
 * @apiError (Error 404) {String} error The attraction image was not found.
 * @apiError (Error 500) {String} error The server encountered an error while fetching the photo
 */
app.get("/attractions/:attractionID/photos", getAttractionPhoto)
/**
 * @api {get} /attractions/:attractionID/photos/count The number of photos an attraction has
 * @apiName GetAttractionphotosCount
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The id of the attraction
 * 
 * @apiSuccess (Success 200) {Number} count The number of images the attraction has.
 * 
 * @apiError (Error 500) error The server encountered an internal error while fetching the count
 * @apiError (Error 404) The attraction was not found.
 * 
 */
app.get("/attractions/:attractionID/photos/count", getAttractionPhotosCount)


//themepark requests
app.post("/themepark", validateTokens, addThemePark) //basic toevoegen van een themepark
/**
 * @api {get} /themepark/:themeparkID Get the information of the themepark
 * @apiname GetThemepark
 * @apiGroup Themepark
 * 
 * @apiParam {Number} themeparkID The unique id of the themepark
 * 
 * @apiSuccess (Success 200) {String} name The name of the themepark
 * @apiSuccess (Success 200) {String} openingdate The opening date of the themeparl
 * @apiSuccess (Success 200) {Number} streetNumber The street number of the themepark
 * @apiSuccess (Success 200) {String} postalCode The postal code of the city of the themepark
 * @apiSuccess (Success 200) {String} country The country of the themepark
 * @apiSuccess (Success 200) {String} type The type of the themepark (indoors/outdoors)
 * @apiSuccess (Success 200) {String} website The website of the themepark
 * @apiSuccess (Success 200) {Number} id The id of the themepark
 * 
 * 
 * @apiError (Error 400) themeparkID The themeparkID was not correctly provided.
 * @apiError (Error 404) error Themepark was not found.
 * @apiError (Error 500) error Internal server error
 * 
 */
app.get("/themepark/:themeparkID", findThemeParkByID) //geeft alle informatie terug van een pretpark
app.put("/themepark/:themeparkID", validateTokens, editThemePark)
app.get("/themeparks/find", findThemeParkByName) //search voor alle bestaande pretparken query is op naam ?query=&limit=&page= allemaal optioneel

//event requests
app.post("/event", validateTokens, addEvent) //basic event toevoegen zoals attracties toevoegen
app.get("/event/:eventID", findEventByID) //basic event informatie krijgen zoals get attraction
app.get("/events/find", findEvents) //search voor alle bestaande events zoals de find van attracties ?query=&limit=&page= allemaal optioneel
app.post("/event/:eventID/join", validateTokens, userJoinEvent) //laat een user een event joinen geen body of query params nodig
app.get("/event/:eventID/userjoined", validateTokens, userJoinedEvent) // checked of een user deel neemt aan een bepaald event geen body of query nodig, geeft result: true terug als deelneemt of false indien niet
app.get("/event/:eventID/attendees", validateTokens, findEventUsers) // geeft een lijst van attendees mee (kan enkel door de user die het event aanmaakte opgevraagd worden) met pagination ?limit=&page=?
app.get("/event/:eventID/attendees/count", eventAttendeesCount) // geeft het aantal deelnemers van een event terug bv result: 13
app.get("/event/userJoined", validateTokens, findUserJoinedEvents) // geeft een lijst van events mee waar een user aan deel neemt met pagination ?limit=&page=
app.use("/API", express.static(__dirname + '/APIDocumentation/'))

//feed requests
app.get("/feed", sendFeeds);





const port = 5001
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});


