import { Attraction } from "./Attraction";
import { db, getAttraction, getAttractionReviews, getReview } from "./database";
import { User } from "./User";

function addAttraction(req: any, res: any) {
  const {
    name,
    themepark,
    opening,
    Builder,
    type,
    length,
    height,
    inversions,
    duration,
  } = req.body;
  const userid = req.user.id
  db.run(
    "INSERT INTO attractions (userID, name, themepark, opening, Builder, type, length, height, inversions, duration) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userid,
      name,
      themepark,
      opening,
      Builder,
      type,
      length,
      height,
      inversions,
      duration,
    ],
    (error: Error) => {
      if (error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.json({ added: true });
      }
    },
  );
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
      res.status(404).json({review: "Review is not found"});
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

function updateAttraction(req:any, res: any) {
  const attractionID = parseInt(req.params.attractionID)
  const {name,
    themepark,
    opening,
    Builder,
    type,
    length,
    height,
    inversions,
    duration,} = req.body
    if(name) {
      // change attraction name
    }
    if(opening) {
      // change opening
    }
    if(themepark) {
      // change themepark
    }
    if(Builder) {
      // change builder
    }
    if(type) {
      // change type
    }
    if(length) {
      //change length
    }
    if(height) {
      // change height
    }
    if(inversions) {
      // change inversions
    }
    if(duration) {
      // change duration
    }
}
export {
  addAttraction,
  findAttractionById,
  findAttractionReviews,
  findReview,
  setAttractionReview,
  updateAttraction
};
