import { buffer } from "stream/consumers";
import { Attraction } from "./Attraction";
import {
  db,
  findAttractionName,
  getAttraction,
  getAttractionsByName,
  getAttractionRating,
  getAttractionReviews,
  getLastId,
  getReview,
} from "./database";
import { User } from "./User";

async function addAttraction(req: any, res: any) {
  const {
    name,
    themepark,
    openingdate,
    builder,
    type,
    length,
    height,
    inversions,
    duration,
  } = req.body;
  const userid = req.user.id;
  db.get(
    "INSERT INTO attractions (userID, name, themepark) VALUES(?, ?, ?) RETURNING id",
    [
      userid,
      name,
      themepark,
    ],
    (error: Error, result: any) => {
      if (error) {
        return res.status(400).json({ error: error.message });
      } else {
        const lastid = result.id;
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
            "INSERT INTO attractionstype (id, opening) VALUES(?, ?)",
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
}

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
  const id = req.params.attractionID;
  getAttraction(id, function (error: any, attraction: Attraction | null) {
    if (error) {
      return res.status(400).json({ error: error });
    }
    if (attraction) {
      return res.status(200).json(attraction.toJSON());
    } else {
      return res.status(400).json({
        attractionID: "No attraction found with the given ID",
      });
    }
  });
}

function findAttractionByName(req: any, res: any) {
  const attractionName = req.query.query;
  var page = parseInt(req.query.page);
  var limit = parseInt(req.query.limit);
  if (!attractionName) {
    res.status(400).json({ error: "The name of the attraction is required" });
  }
  if (isNaN(page)) {
    page = 0;
  }
  if (isNaN(limit)) {
    limit = 0;
  }
  getAttractionsByName(attractionName, page, limit, function (error, result) {
    if (error) {
      res.status(400).json(error);
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: true, reviews: "No attractions found" });
    }
  });
}

function addAttractionReview(
  attractionID: number,
  userID: number,
  review: string,
  stars: number,
  getErr: (error: any | null) => void,
) {
  db.run(
    "INSERT INTO attractionreview (attractionID, userID, review, stars, date) VALUES(?, ?, ?, ?, datetime('now'))",
    [attractionID, userID, review, stars],
    (error: Error) => {
      if (error) {
        getErr({ error: true, review: error.message });
      } else {
        getErr(null);
      }
    },
  );
}

function updateAttractionReview(
  attractionID: number,
  userID: number,
  review: string,
  stars: number,
  getErr: (error: any) => void,
) {
  db.run(
    "UPDATE  attractionreview SET review = ?, stars = ?, date = datetime('now') WHERE attractionID = ? AND userID = ?",
    [review, stars, attractionID, userID],
    (error: Error) => {
      if (error) {
        getErr({ error: true, review: error.message });
      } else {
        getErr(null);
      }
    },
  );
}

function setAttractionReview(req: any, res: any) {
  const attractionID = req.params.attractionID;
  const review = req.body.review;
  const stars = req.body.stars;
  const user: User = req.user;
  const userID: number = user.id;
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
                return res.status(400).json(error);
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
                return res.status(400).json(error);
              } else {
                return res.status(200).json({ added: true });
              }
            },
          );
        }
      });
    } else {
      return res.status(400).json({
        error: true,
        attractionID: "No attraction found for this ID",
      });
    }
  });
}

function findReview(req: any, res: any) {
  const attractionID = req.params.attractionID;
  const userID = req.query.userid;
  getReview(attractionID, userID, function (error, result) {
    if (error) {
      res.status(400).json(error);
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

function getAverageRating(req: any, res: any) {
  const attractionID = req.params.attractionID;
  getAttractionRating(attractionID, function (error, result) {
    if (error) {
      res.status(400).json({ error: error });
    } else if (result) {
      res.status(200).json({ rating: result });
    }
  });
}

function findAttractionReviews(req: any, res: any) {
  const attractionID = parseInt(req.params.attractionID);
  var page = parseInt(req.query.page);
  var limit = parseInt(req.query.limit);
  if (isNaN(attractionID)) {
    res.status(400).json({ error: "The number of the attraction is required" });
  }
  if (isNaN(page)) {
    page = 0;
  }
  if (isNaN(limit)) {
    limit = 0;
  }
  getAttractionReviews(attractionID, page, limit, function (error, result) {
    if (error) {
      res.status(400).json(error);
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: true, reviews: "No reviews found" });
    }
  });
}

function updateAttraction(req: any, res: any) {
  const lastid = parseInt(req.params.attractionID);
  const userid = req.user.id;
  const {
    name,
    themepark,
    opening,
    builder,
    type,
    length,
    height,
    inversions,
    duration,
  } = req.body;

  db.run(
    "UPDATE attractions SET userID = ?, name = ?, themepark = ? WHERE id = ?",
    [userid, name, themepark, lastid],
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
          ], function (error) {
            console.log(error)
          }
        );
      }
      if (type) {
        db.run(
          "REPLACE INTO attractionstype (id, opening) VALUES(?, ?)",
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
      return res.json({ added: true });
    },
  );
}

function getAttractionName(req: any, res: any) {
  const id = req.params.attractionID;
  findAttractionName(id, function (error, result) {
    if (error) {
      return res.status(404).json({ error: error });
    }
    if (result) {
      return res.status(200).json({ name: result });
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
  getAverageRating,
  setAttractionReview,
  updateAttraction,
  addAttractionPhotos,
};
