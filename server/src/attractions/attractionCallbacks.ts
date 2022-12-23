import { Attraction } from "./Attraction";
import {
  db,
  findAttractionName,
  getAttraction,
  getAttractionsByName,
  getAttractionRating,
  getAttractionReviews,
  getReview,
  getThemePark,
} from "../database";
import { User } from "../userManagement/User";


/**
 * 
 * Validate all the input when adding or modifying an attraction
 * @param input the input fields
 * @param getResult the potential error message.
 */
function checkAttractionInformation(input: any,): string {
  const {
    name,
    openingdate,
    builder,
    type,
    length,
    height,
    inversions,
    duration,
  } = input;
  
  const themeparkID: number = parseInt(input.themeparkID)

  if(!name || typeof name != 'string'){
    return("A valid attraction name must be provided");
  }
  if(isNaN(themeparkID)) {
    return("Theme park ID must be a valid integer")
  }
  if(openingdate && typeof openingdate != 'string'){
    return("opening not valid")
  }
  if(builder &&  typeof builder != 'string'){
    return("builder not valid")
  }
  if(type &&  typeof type != 'string'){
    return("type not valid")
  }
  if(length &&  typeof length != 'string'){
    return("Length not valid")
  }
  if(height &&  typeof height != 'string'){
    return("height not valid")
  }
  if(inversions &&  typeof inversions != 'string'){
    return("inversions not valid")
  }
  if(duration &&  typeof duration != 'string'){
    return("duration not valid")
  }
  return("")
  
}
// attractie toevoegen aan db
async function addAttraction(req: any, res: any) {
  const validationError = checkAttractionInformation(req.body)
  if(validationError) {
    return res.status(400).json({error: validationError})
  }

    const {
      name,
      themeparkID,
      openingdate,
      builder,
      type,
      length,
      height,
      inversions,
      duration,
    } = req.body;
    const userid = req.user.id;
  
  
    //verplichte fields invullen
    getThemePark(themeparkID,
      function (error: any, result: any)  {
        if (error) {
          return res.status(400).json({ themepark: "ID does not exist"});
        } else if (result) {
          db.get(
            "INSERT INTO attractions (userID, name, themepark, themeparkID) VALUES(?, ?, ?, ?) RETURNING id",
            [
              userid,
              name,
              result.name,
              themeparkID,
            ],
            (error: Error, result: any) => {
              if (error) {
                return res.status(400).json({ error: error.message });
              } else {
                const lastid = result.id; //id terug geven zodat we optionele informatie kunnen binden aan een attractie
                //telkens testen of de informattie gegeven wordt en dan toevoegen
                if (openingdate) {
                  db.run(
                    "INSERT INTO attractionsopening (id, opening) VALUES(?, ?)",
                    [
                      lastid,
                      openingdate,
                    ],
                  );
                }
                if (builder) {
                  db.run(
                    "INSERT INTO attractionsbuilder (id, builder) VALUES(?, ?)",
                    [
                      lastid,
                      builder,
                    ],
                  );
                }
                if (type) {
                  db.run(
                    "INSERT INTO attractionstype (id, type) VALUES(?, ?)",
                    [
                      lastid,
                      type,
                    ],
                  );
                }
                if (length) {
                  db.run(
                    "INSERT INTO attractionslength (id, length) VALUES(?, ?)",
                    [
                      lastid,
                      length,
                    ],
                  );
                }
                if (height) {
                  db.run(
                    "INSERT INTO attractionsheight (id, height) VALUES(?, ?)",
                    [
                      lastid,
                      height,
                    ],
                  );
                }
                if (inversions) {
                  db.run(
                    "INSERT INTO attractionsinversions (id, inversions) VALUES(?, ?)",
                    [
                      lastid,
                      inversions,
                    ],
                  );
                }
                if (duration) {
                  db.run(
                    "INSERT INTO attractionsduration (id, duration) VALUES(?, ?)",
                    [
                      lastid,
                      duration,
                    ],
                  );
                }
                return res.json({ added: true, id: lastid });
              }
            },
          );
        } else {
          return res.status(400).json({ themepark: "ID does not exist"});
        }
      });
}

// een foto toevoegen aan een attractie
function addAttractionPhotos(req: any, res : any) {
  if (!req.file) {
    return res.status(400).json({ attractionphoto: "please provide a file" });
  } else {
    const attractionID = parseInt(req.params.attractionID);
    const { originalname, mimetype, buffer } = req.file;
    db.run(
      "INSERT INTO attractionphotos (attractionID, filename, type, content) VALUES(?, ?, ?, ?)",
      [attractionID, originalname, mimetype, buffer],
      function (error: Error) {
        if (error) {
          res.status(400).json({
            avatar: "Something went wrong while uploading the user avatar.",
          });
        } else {[
            res.status(200).json({ added: true }),
          ];}
      },
    );
  }
}


function findAttractionById(req: any, res: any) {
  const id = parseInt(req.params.attractionID);
  if (isNaN(id)) {
    res.status(400).json({ error: "The id of the attraction is required" });
  }
  getAttraction(id, function (error: any, attraction: Attraction | null) {
    if (error) {
      return res.status(500).json({ error: error });
    }
    if (attraction) {
      return res.status(200).json(attraction.toJSON());
    } else {
      return res.status(404).json({
        attractionID: "No attraction found with the given ID",
      });
    }
  });
}

// search voor attracties met pagination 
function findAttractionByName(req: any, res: any) {
  var attractionName = req.query.query;
  var page = parseInt(req.query.page);
  var limit = parseInt(req.query.limit);
  if (!attractionName) { //indien niet gegeven, lege string dus wildcard
    attractionName = "";
  }
  if (isNaN(page)) { // indien niet gegeven pagina 0, geeft de eerste pagina terug
    page = 0;
  }
  if (isNaN(limit)) { // indien niet gegeven wordt de limiet op 0 gezet dit zal resulteren in alles teruggeven
    limit = 0;
  }
  getAttractionsByName(attractionName, page, limit, function (error, result) {
    if (error) {
      res.status(500).json({error: error});
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({attractions: "No attractions found" });
    }
  });
}

function findTop10Attractions(req: any, res: any){
  db.all(
    "SELECT a.id, a.name, a.themepark, AVG(r.stars) as avg_rating FROM attractions a JOIN attractionreview r ON a.id = r.attractionID GROUP BY a.id ORDER BY avg_rating DESC LIMIT 10",
    function (error: any, result: any) {
      if (error){
        return res.status(500).json({ error: "internal server error" });
      }else if (result){
        return res.status(200).json({ result: result });
      }else {
        return res.status(400).json({ error: "attractions not found" });
      }
    }
  );
}

/**
 * 
 * @param attractionID the id of the attraction for which the review is placed
 * @param userID the id of the user who placed the review
 * @param review the review text
 * @param stars the rating the user gave for that attraction
 * @param getErr callback to get any errors the server encounters.
 */
function addAttractionReview(
  attractionID: number,
  userID: number,
  review: string,
  stars: number,
  getErr: (error: string) => void,
) {
  db.run(
    "INSERT INTO attractionreview (attractionID, userID, review, stars, date) VALUES(?, ?, ?, ?, datetime('now'))",
    [attractionID, userID, review, stars],
    (error: Error) => {
      if (error) {
        getErr("Something went wrong while adding a review");
      } else {
        getErr("");
      }
    },
  );
}

/**
 * Updates a review on the database.
* @param attractionID the id of the attraction for which the review is placed
 * @param userID the id of the user who placed the review
 * @param review the review text
 * @param stars the rating the user gave for that attraction
 * @param getErr callback to get any errors the server encounters.
 * 
 */
function updateAttractionReview(
  attractionID: number,
  userID: number,
  review: string,
  stars: number,
  getErr: (error: string) => void,
) {
  db.run(
    "UPDATE  attractionreview SET review = ?, stars = ?, date = datetime('now') WHERE attractionID = ? AND userID = ?",
    [review, stars, attractionID, userID],
    (error: Error) => {
      if (error) {
        getErr("Something went wrong while updating a review");
      } else {
        getErr("");
      }
    },
  );
}

function setAttractionReview(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  const review = req.body.review;
  const stars = parseInt(req.body.stars);
  const user: User = req.user;
  const userID: number = user.id;
  if(isNaN(attractionID)) {
    return res.status(400).json({error: "Attraction ID required"})
  }
  if(!review || typeof review != 'string') {
    return res.status(400).json({error: "A review is required"})

  }
  if(isNaN(stars)) {
    return res.status(400).json({error: "Stars should be a number"})
  }
  getAttraction(attractionID, function (error, result) {
    if (error) {
      return res.status(400).json(error);
    } else if (result) {
      getReview(attractionID, userID, function (error, result) {
        if (error) {
          return res.status(400).json(error);
        } else if (result) {
          updateAttractionReview(
            attractionID,
            userID,
            review,
            stars,
            function (error) {
              if (error) {
                return res.status(400).json({error: error});
              } else {
                return res.status(200).json({ updated: true });
              }
            },
          );
        } else {
          addAttractionReview(
            attractionID,
            userID,
            review,
            stars,
            function (error) {
              if (error) {
                return res.status(400).json({error: error});
              } else {
                return res.status(200).json({ added: true });
              }
            },
          );
        }
      });
    } else {
      return res.status(400).json({
        attractionID: "No attraction found for this ID",
      });
    }
  });
}

/**
 * Find a review in the database given the userid (in a query string) and the attractionid (in a parameter)
 */
function findReview(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  const userID = parseInt(req.query.userid);
  if(isNaN(attractionID)) {
    return res.status(400).json({error: "The ID of the attraction is required"})
  }
  if(isNaN(userID)) {
    return res.status(400).json({error: "a valid user ID required"})
  }
  getReview(attractionID, userID, function (error, result) {
    if (error) {
      res.status(500).json({error: error});
    } else if (result) {
      res.status(200).json({
        review: result.review,
        rating: result.rating,
        date: result.date,
      });
    } else {
      res.status(404).json({ review: "Review is not found" });
    }
  });
}
/**
 * Get the average rating of all ratings of an attraction.
 */
function getAverageRating(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  if(isNaN(attractionID)) {
    return res.status(400).json({attractionID: "The id of the attraction is required"})
  }
  getAttractionRating(attractionID, function (error, average, total) {
    if (error) {
      return res.status(500).json({ error: error });
    } else if (average) {
      return res.status(200).json({ rating: average , ratingCount: total});
    }else {
      return res.status(200).json({ rating: 0, ratingCount: 0 });
    }
  });
}


function findAttractionReviews(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  var page = parseInt(req.query.page);
  var limit = parseInt(req.query.limit);
  var order = req.query.orderBy;
  var isDescending = req.query.sort === "desc"
  /**
   * The standard sorting is date ascending if no order or sort is specified
   */
  if(order === undefined) {
    order = "date"
  }
  if(isDescending === undefined) {
    isDescending = false
  }
  /**
   * An attraction id should be defined
   */
  if (isNaN(attractionID)) {
    res.status(400).json({ error: "The id of the attraction is required" });
  }
  if (isNaN(page)) {
    page = 0;
  }
  if (isNaN(limit)) {
    limit = 0;
  }
  getAttractionReviews(attractionID, page, limit, order, isDescending, function (error, result) {
    if (error) {
      res.status(500).json({error: error});
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({reviews: "No reviews found" });
    }
  });
}

function updateAttraction(req: any, res: any) {
  const lastid = parseInt(req.params.attractionID);
  const userid = req.user.id;
  const validationError = checkAttractionInformation(req.body)
  if(validationError) {
    return res.status(400).json({error: validationError})
  }
    const {
      name,
      opening,
      builder,
      type,
      length,
      height,
      inversions,
      duration,
    } = req.body;
    const themeparkID: number = parseInt(req.body.themeparkID)
     
    getThemePark(themeparkID,
      function (error: any, result: any)  {
        if (error) {
          return res.status(400).json({ themepark: "ID does not exist"});
        } else if (result) {
          db.run(
            "UPDATE attractions SET userID = ?, name = ?, themepark = ?, themeparkID = ? WHERE id = ?",
            [userid, name, result.name, themeparkID, lastid],
            function (error) {
              if (error) {
                return res.status(400).json({
                  error:
                    "Something went wrong while updating the attractions information",
                });
              }
              if (opening) {
                db.run(
                  "REPLACE INTO attractionsopening (id, opening) VALUES(?, ?)",
                  [
                    lastid,
                    opening,
                  ],
                );
              }
              if (builder) {
                db.run(
                  "REPLACE INTO attractionsbuilder (id, builder) VALUES(?, ?)",
                  [
                    lastid,
                    builder,
                  ]
                );
              }
              if (type) {
                db.run(
                  "REPLACE INTO attractionstype (id, type) VALUES(?, ?)",
                  [
                    lastid,
                    type,
                  ],
                );
              }
              if (length) {
                db.run(
                  "REPLACE INTO attractionslength (id, length) VALUES(?, ?)",
                  [
                    lastid,
                    length,
                  ],
                );
              }
              if (height) {
                db.run(
                  "REPLACE INTO attractionsheight (id, height) VALUES(?, ?)",
                  [
                    lastid,
                    height,
                  ],
                );
              }
              if (inversions) {
                db.run(
                  "REPLACE INTO attractionsinversions (id, inversions) VALUES(?, ?)",
                  [
                    lastid,
                    inversions,
                  ],
                );
              }
              if (duration) {
                db.run(
                  "REPLACE INTO attractionsduration (id, duration) VALUES(?, ?)",
                  [
                    lastid,
                    duration,
                  ],
                );
              }
              return res.status(200).json({ updated: true });
            },
          );
        } else {
          return res.status(400).json({ themepark: "theme park ID does not exist"})
        }
      });
  }

function getAttractionName(req: any, res: any) {
  const id = parseInt(req.params.attractionID);
  if(isNaN(id)) {
    return res.status(400).json({attractionID: "The id of the attraction is required"})
  }
  findAttractionName(id, function (error, result) {
    if (error) {
      return res.status(404).json({ error: error });
    }
    if (result) {
      return res.status(200).json({ name: result });
    }
  });
}

/**
 * 
 * Fetch an attraction photo from the database, given the attractionID and the photo ID.
 * The database stores the image and its type.
 * content-type will be set to the image type.
 */
function getAttractionPhoto(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID)
  const imageID = parseInt(req.query.id)
  if(isNaN(attractionID)) {
    return res.status(400).json({error: "The id of the attraction should be provided"})
  }
  if(isNaN(imageID)) {
    return res.status(400).json({error: "The id of the image should be provided"})
  }
  db.all("SELECT * FROM attractionphotos WHERE attractionID = ?", [attractionID], (error, result) => {
    if(error) {
      return res.status(500).json({error: "Something when wrong while getting the attraction photo"})
    }
    if(result) {
      let image = result[imageID]

      if(image) {
        res.set("Content-Type", image.type);
        res.status(200).send(image.content);
      } else {
        res.status(404).json({error: "The attraction image is not found"})
      }
    } else {
      res.status(404).json({error: "The attraction image is not found"})
    }
  })
}

function getAttractionPhotosCount(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  if(isNaN(attractionID)) {
    return res.status(400).json({error: "The id of the attraction should be provided"})
  }
  db.get("SELECT COUNT(*) FROM attractionphotos WHERE attractionID = ?", [attractionID], (error, result) => {
    if(error) {
      res.status(500).json({error: "Something went wrong while getting the count of the attractions photos"})
    }
    if(result) {
      res.status(200).json({count: result["COUNT(*)"]})
    } else {
      res.status(404).json({count: "The count could not be found"})
    }
  })
}

// geeft het aantal attracties
function AttractionCount(req: any, res: any){
  db.get(
      "SELECT COUNT(*) from attractions",
      function (error, countResult) {
          if (error) {
              return res.status(400).json({ error: "something whent wrong while getting the attractions" });
          } else {
              return res.status(200).json({ result: countResult["COUNT(*)"] });
          }
      });
}


export {
  addAttraction,
  findAttractionById,
  findAttractionByName,
  findAttractionReviews,
  findReview,
  getAttractionName,
  findTop10Attractions,
  getAverageRating,
  setAttractionReview,
  updateAttraction,
  addAttractionPhotos,
  getAttractionPhoto,
  getAttractionPhotosCount,
  AttractionCount 
};
