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
  db.run(
    "INSERT INTO attractions (name, themepark, opening, Builder, type, length, height, inversions, duration) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
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
        return res.json({ registered: true });
      }
    },
  );
}

function findAttractionById(req: any, res: any) {
  const id = req.body.attractionID;
  getAttraction(id, function (error: any, attraction: Attraction | null) {
    if (error) {
      return res.status(400).json(error);
    }
    if (attraction) {
      return res.status(200).json(attraction.toJSON());
    } else {
      return res.status(200).json({
        error: true,
        attractionID: "No attraction found with the given ID",
      });
    }
  });
}

function addAttractionReview(
  attractionID: number,
  userID: number,
  review: string,
  getErr: (error: any | null) => void,
) {
  db.run(
    "INSERT INTO attractionreview (attractionID, userID, review, date) VALUES(?, ?, ?, datetime(\'now\'))",
    [attractionID, userID, review],
    (error: Error) => {
      if (error) {
        getErr({error: true, review: error.message});
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
  getErr: (error: any) => void,
) {
  db.run(
    "UPDATE  attractionreview SET review = ?, date = datetime(\'now\') WHERE attractionID = ? AND userID = ?",
    [review, attractionID, userID],
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
  const attractionID = req.body.attractionID;
  const review = req.body.review;
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
            function (error) {
              if (error) {
                return res.status(400).json(error);
              } else {
                return res.status(200).json({error: false})
              }
            },
          );
        } else {
          addAttractionReview(attractionID, userID, review, function (error) {
            if (error) {
              return res.status(400).json(error);
            } else {
              return res.status(200).json({error: false})
            }
          });
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
  const attractionID = req.body.attractionID;
  const userID = req.body.userID;
  getReview(attractionID, userID, function (error, result) {
    if (error) {
      res.status(400).json(error);
    } else if (result) {
      res.status(200).json({ error: false, review: result.review, date: result.date });
    } else {
      res.json({ error: false, review: "" });
    }
  });
}

function findAttractionReviews(req: any, res: any) {
  const attractionID = req.body.attractionID
  getAttractionReviews(attractionID, function (error, result) {
    if(error) {
      res.status(400).json(error)
    } else if(result) {
      res.status(200).json(result)
    } else {
      res.status(400).json({error: true, reviews: "No reviews found"})
    }
  })
}
export { addAttraction, findAttractionById, findReview, setAttractionReview, findAttractionReviews };
