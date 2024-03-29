import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validateTokens } from "./userManagement/JWT";
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
} from "./userManagement/userManagementCallbacks";
import { addAttraction, findAttractionById, findAttractionByName, findAttractionReviews, findReview, getAttractionName, getAverageRating, setAttractionReview, updateAttraction, addAttractionPhotos, getAttractionPhoto, getAttractionPhotosCount, AttractionCount, findTop10Attractions } from "./attractions/attractionCallbacks";
import { addThemePark, editThemePark, findThemeParkByID, findThemeParkByName } from "./themeparks/themeParkCallbacks";
import multer from "multer";
import { sendFeeds } from "./feeds/feedsCallbacks";
import { addEvent, findEvents, findEventByID, findEventUsers, findUserJoinedEvents, userJoinedEvent, eventAttendeesCount, userJoinEvent } from "./events/eventCallbacks";


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
/**
 * @api {get} /attraction/top Get the top 10 best rated attractions
 * @apiName GetTop10Attractions
 * @apiGroup Attraction
 *  
 * @apiSuccess (Success 200) {Object[]} result An array containing the top 10 attractions
 * @apiSuccess (Success 200) {string} result.id The id of the attraction
 * @apiSuccess (Success 200) {string} result.name The name of the attraction
 * @apiSuccess (Success 200) {string} result.themepark The name of the themepark the attracion is located
 * @apiSuccess (Success 200) {string} result.avg_rating The avarege rating of the attraction
 * 
 * @apiError (Error 500) {String} error The server encountered an error while fetching the attractions
 */
app.get("/attraction/top", findTop10Attractions);
/**
 * @api {get} /attraction/count Get the number of attractions in our database
 * @apiName GetAttractionCount
 * @apiGroup Attraction
 *  
 * @apiSuccess (Success 200) {string} result An the number of attractions
 * 
 * @apiError (Error 400) {String} error No attractions found
 * @apiError (Error 400) {String} error The server encountered an error while fetching the attractions
 */
app.get("/attraction/count", AttractionCount);
app.post("/attraction/:attractionID/photos", [validateTokens, upload.single("image")], addAttractionPhotos); // upload een afbeelding van een attracttie en sla op in db
app.put("/attraction/:attractionID", validateTokens, updateAttraction);
/**
 * @api {get} /attraction/:attractionID Get the information of the attraction
 * @apiName GetAttraction
 * @apiGroup Attraction
 * 
 * @apiParam {Number} attractionID The unique id of the attraction
 * 
 * @apiSuccess (Success 200) {String} opening The openinsdate of the attraction
 * @apiSuccess (Success 200) {String} builder The builder of the attraction
 * @apiSuccess (Success 200) {String} type The type of the attraction
 * @apiSuccess (Success 200) {String} height the height of the attraction
 * @apiSuccess (Success 200) {String} length the length of the track of the attraction
 * @apiSuccess (Success 200) {String} inversions the number of inversersions of the attraction
 * @apiSuccess (Success 200) {String} duration the duration of the attraction in mm:ss
 * @apiSuccess (Success 200) {String} id The id of the attraction in the database
 * 
 * @apiError (Error 404) {String} attractionID No attraction found with the given ID.
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
 * @apiError (Error 500) {String} error The server encountered an error while fetching the review
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
 * @apiSuccess (Success 200) {string} review.review The review text
 * @apiSuccess (Success 200) {Number} review.rating The rating that the user gave to the attraction
 * @apiSuccess (Success 200) {String} review.date The date this review was placed/modified
 * @apiSuccess (Success 200) {Object} next The number and limit of the next page
 * @apiSuccess (Success 200) {Number} next.page The number of the next page
 * @apiSuccess (Success 200) {Number} next.limit The limit (amount of reviews) in the next page 
 * @apiSuccess (Success 200) {Object} previous The number and limit of the previous page
 * @apiSuccess (Success 200) {Number} previous.page The number of the previous page
 * @apiSuccess (Success 200) {Number} previous.limit The limit (amount of reviews) in the previous page
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
 * @apiError (Error 400) {String} attractionID The attraction id was not correctly provided.
 * @apiError (Error 500) {String} error The server encountered an error while trying to get the ratings
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
/**
 * @api {get} /attractions/find Get the attractions
 * @apiName GetAttractions
 * @apiGroup Attraction
 * 
 * @apiQuery {Number} page The attraction page
 * @apiQuery {Number} limit How many attractions in a page
 * @apiQuery {String} query The query on what you want to search, attrractionName or themeparkName where the attraction is located
 * 
 * @apiSuccess (Success 200) {Object[]} result An array containing all the attractions
 * @apiSuccess (Success 200) {string} result.id The id of the attraction
 * @apiSuccess (Success 200) {string} result.userID The id of the user who made the attraction
 * @apiSuccess (Success 200) {string} result.name The name of the attraction
 * @apiSuccess (Success 200) {string} result.themepark The name of the themepark where the attraction is located
 * @apiSuccess (Success 200) {string} result.themeparkID The id of the themepark where the attraction is located
 * @apiSuccess (Success 200) {Object} next The number and limit of the next page
 * @apiSuccess (Success 200) {Number} next.page The number of the next page
 * @apiSuccess (Success 200) {Number} next.limit The limit (amount of attractions) in the next page 
 * @apiSuccess (Success 200) {Object} previous The number and limit of the previous page
 * @apiSuccess (Success 200) {Number} previous.page The number of the previous page
 * @apiSuccess (Success 200) {Number} previous.limit The limit (amount of attractions) in the previous page
 * 
 * @apiError (Error 404) {String} attractions No attractions found
 * 
 * @apiError (Error 500) {String} error The server encountered an error while fecthing the attractions.
 */
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
 * @apiError (Error 404) count The attraction is not found, or the count could not have been calculated (i.e. there are no photos).
 * @apiError (Error 500) error The server encountered an internal error while fetching the count
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
 * @apiSuccess (Success 200) {String} openingdate The opening date of the themepark
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
/**
 * @api {get} /themeparks/find Get the themeparks
 * @apiName GetThemeparks
 * @apiGroup Themepark
 * 
 * @apiQuery {Number} page The themepark page
 * @apiQuery {Number} limit How many themeparks in a page
 * @apiQuery {String} query The query on what you want to search, themeparkName or country of the themepark
 * 
 * @apiSuccess (Success 200) {Object[]} result An array containing all the themeparks
 * @apiSuccess (Success 200) {string} result.id The id of the themepark
 * @apiSuccess (Success 200) {string} result.userID The id of the user who made the themepark
 * @apiSuccess (Success 200) {string} result.name The name of the themepark
 * @apiSuccess (Success 200) {string} result.street The street of the themepark
 * @apiSuccess (Success 200) {string} result.streetnumber The streetnumber of the themepark
 * @apiSuccess (Success 200) {string} result.postalcode The postalcode of the themepark
 * @apiSuccess (Success 200) {string} result.country The country of the themepark
 * @apiSuccess (Success 200) {string} result.lat The latitude coordinate of the themepark
 * @apiSuccess (Success 200) {string} result.long The longitute coordinate of the themepark
 * @apiSuccess (Success 200) {Object} next The number and limit of the next page
 * @apiSuccess (Success 200) {Number} next.page The number of the next page
 * @apiSuccess (Success 200) {Number} next.limit The limit (amount of themeparks) in the next page 
 * @apiSuccess (Success 200) {Object} previous The number and limit of the previous page
 * @apiSuccess (Success 200) {Number} previous.page The number of the previous page
 * @apiSuccess (Success 200) {Number} previous.limit The limit (amount of themeparks) in the previous page
 * 
 * @apiError (Error 404) {String} themeparks  No themeparks found
 * 
 * @apiError (Error 500) {String} error The server encountered an error while fecthing the themeparks.
 */
app.get("/themeparks/find", findThemeParkByName) //search voor alle bestaande pretparken query is op naam ?query=&limit=&page= allemaal optioneel

//event requests
app.post("/event", validateTokens, addEvent) //basic event toevoegen zoals attracties toevoegen
/**
 * @api {get} /event/:eventID Get the information of the event
 * @apiName GetEvent
 * @apiGroup Event
 * 
 * @apiParam {Number} eventID The unique id of the event
 * 
 * @apiSuccess (Success 200) {String} themeparkname The name of the themepark where the evetn takes place
 * @apiSuccess (Success 200) {String} hour The hour that the event starts in hh:mm
 * @apiSuccess (Success 200) {String} description The description of the event
 * @apiSuccess (Success 200) {String} date The date that the event takes palace
 * @apiSuccess (Success 200) {String} themepark The id of the themepark where the event takes place
 * @apiSuccess (Success 200) {String} name The name of the event
 * @apiSuccess (Success 200) {String} userID The id of the user who made the event
 * @apiSuccess (Success 200) {String} id The id of the event in the database
 * 
 * @apiError (Error 404) {String} eventID No event found with the given ID.
 * @apiError (Error 500) {String} error The server encountered an internal error while fetching the event.
 */
app.get("/event/:eventID", findEventByID)
/**
 * @api {get} /events/find Get the events
 * @apiName GetEvents
 * @apiGroup Event
 * 
 * @apiQuery {Number} page The event page
 * @apiQuery {Number} limit How many events in a page
 * @apiQuery {String} query The query on what you want to search, eventName or themepark where the event takes place
 * 
 * @apiSuccess (Success 200) {Object[]} result An array containing all the events
 * @apiSuccess (Success 200) {String} result.themeparkname The name of the themepark where the evetn takes place
 * @apiSuccess (Success 200) {String} result.hour The hour that the event starts in hh:mm
 * @apiSuccess (Success 200) {String} result.description The description of the event
 * @apiSuccess (Success 200) {String} result.date The date that the event takes palace
 * @apiSuccess (Success 200) {String} result.themepark The id of the themepark where the event takes place
 * @apiSuccess (Success 200) {String} result.name The name of the event
 * @apiSuccess (Success 200) {String} result.userID The id of the user who made the event
 * @apiSuccess (Success 200) {String} result.id The id of the event in the database
 * @apiSuccess (Success 200) {Object} next The number and limit of the next page
 * @apiSuccess (Success 200) {Number} next.page The number of the next page
 * @apiSuccess (Success 200) {Number} next.limit The limit (amount of events) in the next page 
 * @apiSuccess (Success 200) {Object} previous The number and limit of the previous page
 * @apiSuccess (Success 200) {Number} previous.page The number of the previous page
 * @apiSuccess (Success 200) {Number} previous.limit The limit (amount of events) in the previous page
 * 
 * @apiError (Error 404) {String} events No events found
 * @apiError (Error 500) {String} error The server encountered an error while fecthing the events.
 */
app.get("/events/find", findEvents) //search voor alle bestaande events zoals de find van attracties ?query=&limit=&page= allemaal optioneel
app.post("/event/:eventID/join", validateTokens, userJoinEvent) //laat een user een event joinen geen body of query params nodig
app.get("/event/:eventID/userjoined", validateTokens, userJoinedEvent) // checked of een user deel neemt aan een bepaald event geen body of query nodig, geeft result: true terug als deelneemt of false indien niet
app.get("/event/:eventID/attendees", validateTokens, findEventUsers) // geeft een lijst van attendees mee (kan enkel door de user die het event aanmaakte opgevraagd worden) met pagination ?limit=&page=?
/**
 * @api {get} /event/:eventID/attendees/count Get the number of attendees of the event
 * @apiName GetEventAttendeesCount
 * @apiGroup Event
 * 
 * @apiParam {Number} eventID The unique id of the event
 * 
 * @apiSuccess (Success 200) {String} result The number of attendees
 * 
 * @apiError (Error 400) {String} result No event found with the given ID.
 * @apiError (Error 500) {String} error The server encountered an internal error while fetching the event.
 */
app.get("/event/:eventID/attendees/count", eventAttendeesCount) // geeft het aantal deelnemers van een event terug bv result: 13
app.get("/events/userJoined", validateTokens, findUserJoinedEvents) // geeft een lijst van events mee waar een user aan deel neemt met pagination ?limit=&page=
app.use("/API", express.static(__dirname + '/APIDocumentation/'))

/**
 * @api {get} /feed Get the recent activities.
 * @apiname GetFeed
 * @apiGroup Feed
 * 
 * @apiDescription This method allows you to get the last 9 recent activities, randomly mixed within each other.
 * The results will be an array consisting of objects. Each object has a type field which specifies what the preview is for.
 * 
 * @apiSuccess (Success 200) {Object[]} Previews An array with the previews
 * @apiSuccess (Success 200) {String} Preview.type The type of the preview (attraction, themepark or review)
 * 
 * @apiSuccess (Success 200) {Number} Preview.attractionID If the preview is for a review, the ID of the attraction for which the review is posted is in the object.
 * @apiSuccess (Success 200) {Number} Preview.userID If the preview is for a review, the ID of the user who posted the review is in the object.
 * @apiSuccess (Success 200) {String} Preview.review If the preview is for a review, the text of the review will be sent in the object.
 * @apiSuccess (Success 200) {Number} Preview.rating If the preview is for a review, the rating will be sent in the object.
 * @apiSuccess (Success 200) {String} Preview.date If the preview is for a review, the date will be sent in the object.
 * 
 * @apiSuccess (Success 200) {String} Preview.name If the preview is for an attraction or a themepark, the name of the attraction or the themepark will be sent.
 * @apiSuccess (Success 200) {Number} Preview.id If the preview is for an attraction or a themepark, the ID of that attraction or a themepark will be sent.
 * @apiSuccess (Success 200) {Number} Preview.userID If the preview is for an attraction or a themepark, the ID of the user who made or updated the attraction or themepark will be sent.
 * 
 * @apiSuccess (Success 200) {String} Preview.themepark If the preview is for an attraction, the name of the themepark to which that attraction belongs will be sent.
 * 
 * 
 * @apiSuccess (Success 200) {String} Preview.country If the preview is for a themepark, the name of the country in which the themepark is located will be sent.
 * 
 * @apiError (Error 500) {String} error The server encountered an error while fetching the previews
 * 
 * 
 */
app.get("/feed", sendFeeds);





const port = 5001
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});


