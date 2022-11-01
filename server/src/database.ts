import { Database } from "sqlite3";
import {User} from "./User";
import bcrypt from "bcrypt";

const db = new Database("thrillreview.db");

function checkForUsernameExistence(
  username: string,
  checkErr: (message: string | null) => void,
): void {
  db.get(
    "SELECT * from users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        checkErr(err.message);
      } else if (result) {
        checkErr("username is already used");
      } else checkErr(null);
    },
  );
}

function checkForEmailExistence(
  email: string,
  checkErr: (message: string | null) => void,
): void {
  db.get(
    "SELECT * from users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        checkErr(err.message);
      } else if (result) {
        checkErr("Email is already used");
      } else checkErr(null);
    },
  );
}

function checkForUserExistence(
    username: string,
    email: string,
    checkErr: (message: string | null) => void,
  ): void {
    checkForUsernameExistence(username, function (usernameError: string | null) {
      if (usernameError) {
        checkErr(usernameError);
      } else {
        checkForEmailExistence(email, function (emailError: string | null) {
          checkErr(emailError);
        });
      }
    });
  }

  function validateUserPassword(
    username: string,
    password: string,
    getError: (error: null | string, user: User | null) => void,
  ) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err: Error, result: any) => {
        if (err) {
          getError(err.message, null);
        }
        if (result) {
          const hashed: string = result.hash;
          bcrypt.compare(password, hashed).then((same) => {
            if (!same) {
              getError("Wrong password!", null);
            } else {
              getError(null, new User(username, result.id));
            }
          });
        } else {
          getError("User does not exist!", null);
        }
      },
    );
  }

export {db, checkForEmailExistence, checkForUsernameExistence, checkForUserExistence, validateUserPassword}