import { Database } from "sqlite3";
import { User } from "./userManagement/User";
import bcrypt from "bcrypt";
import { Attraction } from "./attractions/Attraction";
import { AnyARecord } from "dns";
import Review from "./attractions/Review";
import { count } from "console";
import { start } from "repl";
import { ThemePark } from "./themeparks/ThemePark";
import { Event } from "./events/Event";
import { resolve } from "path";

const db = new Database("thrillreview.db");

/* User tables */
db.run(
"CREATE TABLE IF NOT EXISTS avatars \
(id INTEGER UNIQUE, filename TEXT, type TEXT, content BLOB)",
);
db.run(
"CREATE TABLE IF NOT EXISTS users \
(id INTEGER UNIQUE PRIMARY KEY, username TEXT, email TEXT, hash TEXT)",
);

/* Attractions tables */
db.run(
"CREATE TABLE IF NOT EXISTS attractions \
(id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, themepark STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsopening \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, opening STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsbuilder \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, builder STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionstype \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, type STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionslength \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, length STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsheight \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, height STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsinversions \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, inversions INTEGER)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionsduration \
(id      INTEGER UNIQUE REFERENCES attractions (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, duration STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS attractionreview \
  (attractionID INTEGER, userID INTEGER, review TEXT, stars INTEGERS, date TEXT)",
);

db.run(
  "CREATE TABLE IF NOT EXISTS attractionphotos \
  ( id INTEGER PRIMARY KEY, attractionID INTEGER REFERENCES attractions (id) ON DELETE CASCADE, filename TEXT, type TEXT, content BLOB)",
);
  


/* Themeparks tables */
db.run(
"CREATE TABLE IF NOT EXISTS themeparks \
(id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, street STRING, streetnumber INTEGER, postalcode STRING, country STRING, lat STRING, long STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparksopening \
 (id      INTEGER UNIQUE REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, opening STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparkstype \
 (id      INTEGER UNIQUE REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, type STRING)",
);

db.run(
"CREATE TABLE IF NOT EXISTS themeparkswebsite \
 (id      INTEGER UNIQUE REFERENCES themeparks (id) ON DELETE CASCADE ON UPDATE RESTRICT DEFERRABLE, website STRING)",
);

/* event tables */
db.run(
  "CREATE TABLE IF NOT EXISTS events \
  (id INTEGER UNIQUE PRIMARY KEY, userID INTEGER, name STRING, themepark STRING, date STRING, hour STRING, description TEXT)",
  );

db.run(
  "CREATE TABLE IF NOT EXISTS eventjoin \
  (eventID  REFERENCES events (id) ON DELETE CASCADE ON UPDATE CASCADE, userID   REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE)",
  );

/* JWT tables */
db.run(
  "CREATE TABLE IF NOT EXISTS JWT \
 (token TEXT)",
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
        console.log(err)
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
  getResult: (exists: boolean, error: string) => void,
): void {
  db.get(
    "SELECT * from users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        getResult(false, "Something went wrong when checking for email existence");
      } else if (result) {
        getResult(true, "");
      } else getResult(false, "");
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

function addToken(token: String) {
  db.run(
    "INSERT INTO JWT (token) VALUES(?)",
    [
      token
    ],
  );
}

function removeToken(token: String) {
  db.run("DELETE FROM JWT WHERE token = ?", [token]);
}

function checkForTokenExistence(token: String, getResult: (existence: Boolean) => void) {
  let existence: Boolean;
  db.get(
    "SELECT * FROM JWT WHERE token = ?",
    [token],
    function (err: Error, result: any) {
      if (err){
        getResult(false);
      }else if (result){
        getResult(true);
      }else {
        getResult(false);
      }
    });
}

/**
 * 
 * Get an attraction from the database given its id
 * This function will check all the tables which have information about the attractions
 * 
 * @param attractionID the id of the attraction
 * @param getResult  The callback in which the results will be found
 * If there is an error, the string describing the error will be returned,
 * otherwise, the attraction will be returned.
 */
function getAttraction(
  attractionID: number,
  getResult: (error: string, attraction: Attraction | null) => void,
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
              db.get(
                "SELECT * FROM attractionsheight WHERE id = ?",
                [attractionID],
                function (err: Error, result: any) {
                  if (err) {
                  } else if (result) {
                    height = result.height;
                  }
                  db.get(
                    "SELECT * FROM attractionslength WHERE id = ?",
                    [attractionID],
                    function (err: Error, result: any) {
                      if (err) {
                      } else if (result) {
                        length = result.length;
                      }
                      db.get(
                        "SELECT * FROM attractionsinversions WHERE id = ?",
                        [attractionID],
                        function (err: Error, result: any) {
                          if (err) {
                          } else if (result) {
                            inversions = result.inversions;
                          }
                          db.get(
                            "SELECT * FROM attractionsduration WHERE id = ?",
                            [attractionID],
                            function (err: Error, result: any) {
                              if (err) {
                              } else if (result) {
                                duration = result.duration;
                              }
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
                                      "",
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
                                    getResult("", null);
                                  }
                                },
                              );
                            },
                          );
                        },
                      );
                    },
                  );
                },
              );
            },
          );
        },
      );
    },
  );
}

function getAttractionsByName(
  name: string,
  page: number,
  limit: number,
  getResult: (error: any | null, result: pagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  db.get(
    "SELECT COUNT(*) from attractions where name LIKE ?",
    [ "%"+name+"%" ],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the attractions  ", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM attractions where name LIKE ? LIMIT ?,?",
          [
            "%"+name+"%",
            startIndex,
            limit,
          ],
          function (error, Result) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the attractions.",
                null,
              );
            } else if (Result) {
              const numberOfItems: number = countResult["COUNT(*)"];
              const results: pagination = { result: Result };
              const totalPages = numberOfItems / limit;

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


function findAttractionName(
  attractionID: number,
  getName: (error: string | null, result: string | null) => void,
) {
  db.get(
    "SELECT name FROM attractions WHERE id = ?",
    [attractionID],
    function (error, result) {
      if (error) {
        getName(
          "Something went wrong while retrieving the attraction name",
          null,
        );
      }
      if (result) {
        getName(null, result.name);
      }
    },
  );
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

function getThemeParks(
  getResult: (error: any, result: any | null) => void,
){
  db.all("SELECT * FROM themeparks",
  function (err: Error, results: any) {
    if (err) {
      getResult("Something went wrong while getting the themeparks", null);
    } else if (results) {
      getResult( null, results);
    }
  },
  )
}
function getThemeParksByName(
  name: string,
  page: number,
  limit: number,
  getResult: (error: any | null, result: pagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  db.get(
    "SELECT COUNT(*) from themeparks where name LIKE ?",
    [ "%"+name+"%" ],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the themeparks  ", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM themeparks where name LIKE ? LIMIT ?,?",
          [
            "%"+name+"%",
            startIndex,
            limit,
          ],
          function (error, Result) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the themeparks.",
                null,
              );
            } else if (Result) {
              const numberOfItems: number = countResult["COUNT(*)"];
              const results: pagination = { result: Result };
              const totalPages = numberOfItems / limit;

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

function getAttractionRating(
  attractionID: number,
  getAverage: (error: string | null, result: number | null, totalRatings: number | null) => void,
) {
  db.get("SELECT avg(stars), COUNT(stars) FROM attractionreview WHERE attractionID = ?", [
    attractionID,
  ], function (error: any, result: any) {
    if (result) {
      getAverage(null, result["avg(stars)"], result["COUNT(stars)"]);
    } else {
      console.log(error);
      getAverage(
        "Something went wrong while calculating the average of rating of this attraction",
        null, null
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
interface pagination {
  next?: page;
  previous?: page;
  totalPages?: number;
  result: any;
}
/**
 * The reviews pagination interface
 * Every reviews page knows the previous and the next page
 * if there is one of them
 */
interface reviewsPagination {
  next?: page;
  previous?: page;
  reviews: any;
}
/**
 * 
 * @param attractionID The id of the attraction
 * @param page  Which reviews page to return
 * @param limit How many reviews in a page
 * @param order What is the order of the reviews (order by date or stars)
 * @param isDescending Ascending or descending
 * @param getResult The callback containing the results
 */
function getAttractionReviews(
  attractionID: number,
  page: number,
  limit: number,
  order: string,
  isDescending: boolean,
  getResult: (error: string, result: reviewsPagination | null) => void,
) {
  db.all("PRAGMA table_info(attractionreview);", function (error, result) {
    if(error) {
      getResult("Something went wrong while featching the reviews", null)
    } if(result) {
      if(!result.map((val) => val.name).includes(order)) {
        order = "date"
      }
     
      const startIndex: number = (page - 1) * limit;
      db.get(
        "SELECT COUNT(*) from attractionreview WHERE attractionID = ?",
        [attractionID],
        function (error, countResult) {
          if (error) {
            getResult("Something went wrong while fetching the reviews", null);
          } else {
            /**
             * If  there is no limit (e.g., it's 0), return all the reviews
             */
            if (limit === 0) {
              limit = countResult["COUNT(*)"];
            }
            /* String formatting had to be applied here, but the parameters are thoroughly
            * tested by the server to make sure no injecting attacks can happen */
            db.all(
              `SELECT * FROM attractionreview WHERE attractionID = ?  ORDER BY ${order.concat(isDescending ? " DESC" :" ASC")} LIMIT ?,?`,
              [
                attractionID,
                startIndex,
                limit,
              ],
              function (error, ReviewsResult) {
                if (error) {
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
                  getResult("", results);
                } else {
                  getResult("", null);
                }
              },
            );
          }
        },
      );

    }
  })
  
}
/**
 * Check if a user has an avatar
 * @param id The id of the user
 * @param getErr 
 */
function checkForUserAvatar(
  id: number,
  getErr: (error: string, res: boolean |null) => void,
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
        getErr("", true);
      } else {
        getErr("", false);
      }
    },
  );
}

function getEvent(
  eventID: number,
  getResult: (error: any, event: Event | null) => void,
) {
  db.get(
    "SELECT * FROM events WHERE id = ?",
    [eventID],
    function (err: Error, result: any) {
      if (err){
        getResult("Something went wrong while getting the event.", null);
      } else if (result){
        getResult(null, 
          new Event(
            result.name,
            result.themepark,
            result.date,
            result.hour,
            result.description,
            result.id,
            result.userID
          ),
        );
      } else {
        getResult(null, null);
      }
    }
  );
}

function getEvents(
  name: string,
  page: number,
  limit: number,
  getResult: (error: any | null, result: pagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  db.get(
    "SELECT COUNT(*) from events where name LIKE ?",
    [ "%"+name+"%" ],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the events  ", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM events where name LIKE ? LIMIT ?,?",
          [
            "%"+name+"%",
            startIndex,
            limit,
          ],
          function (error, Result) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the events.",
                null,
              );
            } else if (Result) {
              const numberOfItems: number = countResult["COUNT(*)"];
              const results: pagination = { result: Result };
              const totalPages = numberOfItems / limit;

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

function getEventAttendees(
  eventID: number,
  page: number,
  limit: number,
  getResult: (error: any | null, result: pagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  db.get(
    "SELECT COUNT(*) from eventjoin where eventID = ?",
    [ eventID ],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the events  ", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM eventjoin where eventID = ? LIMIT ?,?",
          [
            eventID,
            startIndex,
            limit,
          ],
          function (error, Result) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the events.",
                null,
              );
            } else if (Result) {
              const numberOfItems: number = countResult["COUNT(*)"];
              const results: pagination = { result: Result };
              const totalPages = numberOfItems / limit;

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

function getEventsJoinedByUser(
  userID: number,
  page: number,
  limit: number,
  getResult: (error: any | null, result: pagination | null) => void,
) {
  const startIndex: number = (page - 1) * limit;
  db.get(
    "SELECT COUNT(*) from eventjoin where userID = ?",
    [ userID ],
    function (error, countResult) {
      if (error) {
        getResult("Something went wrong while fetching the events  ", null);
      } else {
        if (limit === 0) {
          limit = countResult["COUNT(*)"];
        }
        db.all(
          "SELECT * FROM eventjoin where userID = ? LIMIT ?,?",
          [
            userID,
            startIndex,
            limit,
          ],
          function (error, Result) {
            if (error) {
              console.log(error);
              getResult(
                "Something went wrong while trying to get the events.",
                null,
              );
            } else if (Result) {
              const numberOfItems: number = countResult["COUNT(*)"];
              const results: pagination = { result: Result };
              const totalPages = numberOfItems / limit;

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




export {
  checkForEmailExistence,
  checkForUserAvatar,
  checkForUserExistence,
  checkForUsernameExistence,

  addToken,
  removeToken,
  checkForTokenExistence,
  db,

  findAttractionName,
  getAttraction,
  getAttractionsByName,
  getAttractionRating,
  getAttractionReviews,
  
  getLastId,
  getReview,
  getThemeParksByName,
  getThemePark,
  getThemeParks,
  validateUserPassword,
  getEvent,
  getEvents,
  getEventAttendees,
  getEventsJoinedByUser,
};
