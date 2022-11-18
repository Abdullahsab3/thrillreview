import { Database } from "sqlite3";
import { User } from "./User";
import bcrypt from "bcrypt";
import { Attraction } from "./Attraction";

const db = new Database("thrillreview.db");

// TODO: zorg ervoor dat de andere tables ook automatisch gemaakt kunnen worden
db.run('CREATE TABLE IF NOT EXISTS avatars \
(id INTEGER UNIQUE, filename TEXT, type TEXT, content BLOB)')

function checkForUsernameExistence(
  username: string,
  getResult: (error: any) => void,
): void {
  db.get(
    "SELECT * from users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        getResult({ error: true, username: err.message });
      } else if (result) {
        getResult({ error: true, username: "username is already used" });
      } else getResult(null);
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
        getResult({ error: true, email: err.message });
      } else if (result) {
        getResult({ error: true, email: "Email is already used" });
      } else getResult(null);
    },
  );
}

function checkForUserExistence(
  username: string,
  email: string,
  getResult: (error: any) => void,
): void {
  checkForUsernameExistence(username, function (usernameError: any) {
    if (usernameError) {
      getResult(usernameError);
    } else {
      checkForEmailExistence(email, function (emailError: any) {
        getResult(emailError);
      });
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
          { error: true, username: err.message, password: err.message },
          null,
        );
      }
      if (result) {
        const hashed: string = result.hash;
        bcrypt.compare(password, hashed).then((same) => {
          if (!same) {
            getResult({
              error: true,
              password: "You entered the wrong password!",
            }, null);
          } else {
            getResult(null, new User(username, result.id));
          }
        });
      } else {
        getResult({ error: true, username: "User does not exist!" }, null);
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
        getResult({ error: true, name: err.message }, null);
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
        getResult(null, null)
      }
    },
  );
}

export {
  checkForEmailExistence,
  checkForUserExistence,
  checkForUsernameExistence,
  db,
  validateUserPassword,
  getAttraction
};
