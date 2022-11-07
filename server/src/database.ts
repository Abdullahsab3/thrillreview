import { Database } from "sqlite3";
import {User} from "./User";
import bcrypt from "bcrypt";

const db = new Database("thrillreview.db");

function checkForUsernameExistence(
  username: string,
  getResult: (error: any) => void,
): void {
  db.get(
    "SELECT * from users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        getResult({error: true, username: err.message});
      } else if (result) {
        getResult({error: true, username: "username is already used"});
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
        getResult({error: true, email: err.message});
      } else if (result) {
        getResult({error: true, email: "Email is already used"});
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
          getResult({error: true, username: err.message, password: err.message}, null);
        }
        if (result) {
          const hashed: string = result.hash;
          bcrypt.compare(password, hashed).then((same) => {
            if (!same) {
              getResult({error: true, password: "You entered the wrong password!"}, null);
            } else {
              getResult(null, new User(username, result.id));
            }
          });
        } else {
          getResult({error: true, username: "User does not exist!"}, null);
        }
      },
    );
  }

export {db, checkForEmailExistence, checkForUsernameExistence, checkForUserExistence, validateUserPassword}