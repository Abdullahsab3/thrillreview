import { Database } from "sqlite3";
import { User } from "./User";
import bcrypt from "bcrypt";
import { Attraction } from "./Attraction";
import { AnyARecord } from "dns";
import Review from "./Review";
import { count } from "console";
import { start } from "repl";

const db = new Database("thrillreview.db");

// TODO: zorg ervoor dat de andere tables ook automatisch gemaakt kunnen worden
db.run(
"CREATE TABLE IF NOT EXISTS avatars \
(id INTEGER UNIQUE, filename TEXT, type TEXT, content BLOB)",
);
db.run(
"CREATE TABLE IF NOT EXISTS attractionreview \
(attractionID INTEGER, userID INTEGER, review TEXT, stars INTEGERS, date TEXT)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractions \
(id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, themepark STRING, opening STRING, builder STRING, type STRING, length STRING, height STRING, inversions INTEGER, duration STRING)",
);

function checkForUsernameExistence(
  username: string,
  getResult: (exists: boolean, message: string | null) => void,
): void {
  db.get(
    "SELECT * from users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        getResult(
          false,
          "Something went wrong when checking for username existence",
        );
      } else if (result) {
        getResult(true, null);
      } else getResult(false, null);
    },
  );
}

function checkForEmailExistence(
  email: string,
  getResult: (error: any) => void,
): void {
  db.get(
    "SELECT * from users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        getResult("Something went wrong when checking for email existence");
      } else if (result) {
        getResult("Email is already used");
      } else getResult(null);
    },
  );
}

function checkForUserExistence(
  username: string,
  email: string,
  getResult: (error: any) => void,
): void {
  checkForUsernameExistence(username, function (exists: boolean, message: any) {
    if (exists) {
      checkForEmailExistence(email, function (emailError: any) {
        getResult(emailError);
      });
    } else {
      getResult(message);
    }
  });
}

function validateUserPassword(
  username: string,
  password: string,
  getResult: (validated: boolean, error: string | null, user?: User) => void,
) {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err: Error, result: any) => {
      if (err) {
        getResult(
          false,
          "Something went wrong when validating the user password.",
        );
      } else if (result) {
        const hashed: string = result.hash;
        bcrypt.compare(password, hashed).then((same) => {
          if (!same) {
            getResult(false, null);
          } else {
            getResult(true, null, new User(result.username, result.id));
          }
        });
      } else {
        getResult(false, null);
      }
    },
  );
}

function getAttraction(
  attractionID: number,
  getResult: (error: any, attraction: Attraction | null) => void,
) {
  db.get(
    "SELECT * FROM attractions WHERE id = ?",
    [attractionID],
    function (err: Error, result: any) {
      if (err) {
        getResult("Something went wrong when getting the attraction.", null);
      }
      if (result) {
        getResult(
          null,
          new Attraction(
            result.name,
            result.themepark,
            result.opening,
            result.builder,
            result.type,
            result.height,
            result.length,
            result.inversions,
            result.duration,
            result.id,
          ),
        );
      } else {
        getResult(null, null);
      }
    },
  );
}

function getAttractionRating(
  attractionID: number,
  getAverage: (error: string | null, result: number | null) => void,
) {
  db.get("SELECT avg(stars) FROM attractionreview WHERE attractionID = ?", [
    attractionID,
  ], function (error: any, result: any) {
    if (result) {
      getAverage(null, result["avg(stars)"]);
    } else{
      console.log(error)
      getAverage("Something went wrong while calculating the average of rating of this attraction", null)
    }
  });
}

function getReview(
  attractionID: number,
  userID: number,
  getResult: (error: any, review: Review | null) => void,
) {
  db.get(
    "SELECT * FROM attractionreview WHERE attractionID = ? AND userID = ?",
    [attractionID, userID],
    function (error: any, result: any) {
      if (error) {
        getResult(
          "Something went wrong when trying to get the user review.",
          null,
        );
      } else if (result) {
        getResult(
          null,
          new Review(
            attractionID,
            userID,
            result.review,
            result.rating,
            result.date,
          ),
        );
      } else {
        getResult(null, null);
      }
    },
  );
}

interface page {
  page: number;
  limit: number;
}
interface reviewsPagination {
  next?: page;
  previous?: page;
  totalPages?: number;
  reviews: any;
}
function getAttractionReviews(
  attractionID: number,
  page: number,
  limit: number,
  getResult: (error: any | null, result: reviewsPagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  const endIndex: number = page * limit;
  db.get(
    "SELECT COUNT(*) from attractionreview WHERE attractionID = ?",
    [attractionID],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the reviews", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM attractionreview WHERE attractionID = ? LIMIT ?,?",
          [
            attractionID,
            startIndex,
            limit,
          ],
          function (error, ReviewsResult) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the reviews.",
                null,
              );
            } else if (ReviewsResult) {
              const numberOfReviews: number = countResult["COUNT(*)"];
              const results: reviewsPagination = { reviews: ReviewsResult };
              const totalPages = numberOfReviews / limit;

              if (page < totalPages) {
                results.next = {
                  page: page + 1,
                  limit: limit,
                };
              }
              if (startIndex > 0) {
                results.previous = {
                  page: page - 1,
                  limit: limit,
                };
              }

              getResult(null, results);
            } else {
              getResult(null, null);
            }
          },
        );
      }
    },
  );
}

function checkForUserAvatar(
  id: number,
  getErr: (error: string | null, res: number | null) => void,
) {
  db.get(
    "SELECT id FROM avatars WHERE id = ?",
    id,
    (err: Error, result: any) => {
      if (err) {
        getErr(
          "Something went wrong while trying to check the user avatar",
          null,
        );
      }
      if (result) {
        getErr(null, result.id);
      } else {
        getErr(null, null);
      }
    },
  );
}

export {
  checkForEmailExistence,
  checkForUserAvatar,
  checkForUserExistence,
  checkForUsernameExistence,
  db,
  getAttraction,
  getAttractionReviews,
  getReview,
  validateUserPassword,
  getAttractionRating
};
