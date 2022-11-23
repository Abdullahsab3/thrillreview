import { Database } from "sqlite3";
import { User } from "./User";
import bcrypt from "bcrypt";
import { Attraction } from "./Attraction";
import { AnyARecord } from "dns";
import Review from "./Review";

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
      getResult(message)
    }
  });
}

function validateUserPassword(
  username: string,
  password: string,
  getResult: (error: any, user: User | null) => void,
) {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err: Error, result: any) => {
      if (err) {
        getResult(
          "Something went wrong when validating the user password.",
          null,
        );
      }
      if (result) {
        const hashed: string = result.hash;
        bcrypt.compare(password, hashed).then((same) => {
          if (!same) {
            getResult("You entered the wrong password!", null);
          } else {
            getResult(null, new User(username, result.id));
          }
        });
      } else {
        getResult("User does not exist!", null);
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

function getAttractionReviews(
  attractionID: number,
  getResult: (error: any | null, result: any | null) => void,
) {
  db.all("SELECT * FROM attractionreview WHERE attractionID = ?", [
    attractionID,
  ], function (error, result) {
    if (error) {
      getResult("Something went wrong when trying to get the reviews.", null);
    } else if (result) {
      getResult(null, { reviews: result });
    } else {
      getResult(null, null);
    }
  });
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
};
