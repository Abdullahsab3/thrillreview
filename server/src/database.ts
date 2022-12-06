import { Database } from "sqlite3";
import { User } from "./User";
import bcrypt from "bcrypt";
import { Attraction } from "./Attraction";
import { AnyARecord } from "dns";
import Review from "./Review";
import { count } from "console";
import { start } from "repl";
import { ThemePark } from "./ThemePark";

const db = new Database("thrillreview.db");

/* User tables */
db.run(
"CREATE TABLE IF NOT EXISTS avatars \
(id INTEGER UNIQUE, filename TEXT, type TEXT, content BLOB)",
);
db.run(
"CREATE TABLE IF NOT EXISTS user \
(id INTEGER UNIQUE PRIMARY KEY, username TEXT, email TEXT, hash TEXT)",
);

/* Attractions tables */
db.run(
"CREATE TABLE IF NOT EXISTS attractions \
(id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, themepark STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsopening \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, opening STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsbuilder \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, builder STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionstype \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, opening STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionslength \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, length STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsheight \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, height STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsinversions \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, inversions INTEGER)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsduration \
(id      INTEGER REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, duration STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionreview \
  (attractionID INTEGER, userID INTEGER, review TEXT, stars INTEGERS, date TEXT)",
);

/* Themeparks tables */
db.run(
"CREATE TABLE IF NOT EXISTS themeparks \
(id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, street STRING, streetnumber INTEGER, postalcode STRING, country STRING, lat STRING, long STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparksopening \
 (id      INTEGER REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, opening STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparkstype \
 (id      INTEGER REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, type STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparkswebsite \
 (id      INTEGER REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, website STRING)",
);

function getLastId() {
  return new Promise<number>((resolve, reject) => {
    db.get(
      "SELECT last_insert_rowid()",
      [],
      (err, result) => {
        resolve(result["last_insert_rowid()"]);
      },
    );
  });
}

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
  let opening = "";
  let builder = "";
  let type = "";
  let height = "";
  let length = "";
  let inversions = "";
  let duration = "";
  db.get(
    "SELECT * FROM attractionsopening WHERE id = ?",
    [attractionID],
    function (err: Error, result: any) {
      if (err) {
        getResult("Something went wrong while getting the attraction", null);
      } else if (result) {
        opening = result.opening;
      }

      db.get(
        "SELECT * FROM attractionsbuilder WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
          } else if (result) {
            builder = result.builder;
          }
        },
      );

      db.get(
        "SELECT * FROM attractionstype WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
            getResult(
              "Something wrong happened while gettint the attraction",
              null,
            );
          } else if (result) {
            type = result.type;
          }
        },
      );

      db.get(
        "SELECT * FROM attractionsheight WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
          } else if (result) {
            height = result.height;
          }
        },
      );

      db.get(
        "SELECT * FROM attractionslength WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
          } else if (result) {
            length = result.length;
          }
        },
      );

      db.get(
        "SELECT * FROM attractionsinversions WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
          } else if (result) {
            inversions = result.inversions;
          }
        },
      );

      db.get(
        "SELECT * FROM attractionsduration WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
          } else if (result) {
            duration = result.duration;
          }
        },
      );

      db.get(
        "SELECT * FROM attractions WHERE id = ?",
        [attractionID],
        function (err: Error, result: any) {
          if (err) {
            getResult(
              "Something went wrong when getting the attraction.",
              null,
            );
          }
          if (result) {
            getResult(
              null,
              new Attraction(
                result.name,
                result.themepark,
                opening,
                builder,
                type,
                height,
                length,
                inversions,
                duration,
                result.id,
              ),
            );
          } else {
            getResult(null, null);
          }
        },
      );
    },
  );
}

function findAttractionName(attractionID: number, getName: (error: string | null, result: string | null) => void) {
  db.get("SELECT name FROM attractions WHERE id = ?", [attractionID], function (error, result) {
    if(error) {
      getName("Something went wrong while retrieving the attraction name", null)
    }
    if(result) {
      getName(null, result.name)
    }
  })
}

function getThemePark(
  themeParkID: number,
  getResult: (error: any, themepark: ThemePark | null) => void,
) {
  let openingsdate = "";
  let type = "";
  let website = "";
  db.get(
    "SELECT * FROM themeparksopening WHERE id = ?",
    [themeParkID],
    function (err: Error, result: any) {
      if (err) {
      } else if (result) {
        openingsdate = result.opening;
      }
    },
  );
  db.get(
    "SELECT * FROM themeparkstype WHERE id = ?",
    [themeParkID],
    function (err: Error, result: any) {
      if (err) {
      } else if (result) {
        type = result.type;
      }
    },
  );
  db.get(
    "SELECT * FROM themeparkswebsite WHERE id = ?",
    [themeParkID],
    function (err: Error, result: any) {
      if (err) {
      } else if (result) {
        website = result.website;
      }
    },
  );
  db.get(
    "SELECT * FROM themeparks WHERE id = ?",
    [themeParkID],
    function (err: Error, result: any) {
      if (err) {
        getResult("Something went wrong while getting the themepark", null);
      } else if (result) {
        getResult(
          null,
          new ThemePark(
            result.name,
            openingsdate,
            result.street,
            result.streetnumber,
            result.postalcode,
            result.country,
            type,
            website,
            result.id,
          ),
        );
      }
    },
  );
}

function getThemeParksInCoordinatesRange(
  minLat: number,
  maxLat: number,
  minLong: number,
  maxLong: number,
  getResult: (error: any, result: any | null) => void,
){
  db.get("SELECT * FROM themeparksopening WHERE lat BETWEEN ? AND ? AND long BETWEEN ? AND ?",
  [
    minLat,
    maxLat,
    minLong,
    maxLong
  ],
  function (err: Error, results: any) {
    if (err) {
      getResult("Something went wrong while getting the themeparks", null);
    } else if (results) {
      getResult( null, results);
    }
  },
  )
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
    } else {
      console.log(error);
      getAverage(
        "Something went wrong while calculating the average of rating of this attraction",
        null,
      );
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
  getAttractionRating,
  getAttractionReviews,
  getLastId,
  getReview,
  getThemePark,
  getThemeParksInCoordinatesRange,
  validateUserPassword,
  findAttractionName
};
