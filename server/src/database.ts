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
              getResult({error: true, username: "", password: "You entered the wrong password!"}, null);
            } else {
              getResult(null, new User(username, result.id));
            }
          });
        } else {
          getResult({error: true, username: "User does not exist!", password: ""}, null);
        }
      },
    );
  }

export {db, checkForEmailExistence, checkForUsernameExistence, checkForUserExistence, validateUserPassword}