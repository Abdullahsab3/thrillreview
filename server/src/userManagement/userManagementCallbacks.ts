import { daysToMilliseconds, minutsToMilliseconds } from "../helpers";
import { User } from "./User";
import {
  checkForEmailExistence,
  checkForUserAvatar,
  checkForUserExistence,
  checkForUsernameExistence,
  removeToken,
  db,
  validateUserPassword,
} from "../database";
import bcrypt from "bcrypt";
import { createRefreshToken, removeRefreshToken, createAccesToken } from "./JWT";

/* 
  Register a new user given its name, email and password

  The callback is expecting in the body of the request:
  username:   the desired username of the user
  email:      the email of the user
  password:   the desired user password.

  callback responses:
  400: The username or the email are already in use.
       returns: JSON response with the error

  500: A server encountered an internal error
       while checking the username or email existence
       or while registering the new user
       returns: JSON response with the error

  200: The user is successfully regisrered
  returns: JSON response indicating a successful registration

*/
function registerNewUser(req: any, res: any) {
  const { username, email, password } = req.body;
  // The callback will first if the username already exists in the database.
  checkForUsernameExistence(
    username,
    function (exists: boolean, message: string | null) {
      if (message) {
        res.status(500).json({ username: message });
      } else if (exists) {
        res.status(400).json({ username: "username is already used" });
      } else {
        // The callback will check whether the email is already used
        checkForEmailExistence(email, function (exists, error) {
          if (error) {
            res.status(500).json({ email: error });
          } else if(exists) {
            res.status(400).json({email: "username is already used"})
          }
          else {
            // hashing the password by a one-way hashing
            // hashing factor = 15
            bcrypt.hash(password, 15).then((hash) => {
              db.run(
                "INSERT INTO users (username, email, hash) VALUES(? , ?, ?)",
                [
                  username,
                  email,
                  hash,
                ],
                (error: Error) => {
                  if (error) {
                    return res.status(500).json(
                      {
                        error:
                          "Something went wrong while trying to register the user.",
                      },
                    );
                  } else {
                    return res.status(200).json({ added: true });
                  }
                },
              );
            });
          }
        });
      }
    },
  );
}

/* 
  A callback to change the password.
  The user is required to be authenticated.

  Expteced in request body:
  password: the old password of the user
  newPassword: the new password

  callback responses:
  400: wrong password

  500: internal server error while checking or updating the password

  200: Password succesfully updated.


*/
function ChangePassword(req: any, res: any) {
  const user: User = req.user;
  const oldPassword: string = req.body.password;
  const newPassword: string = req.body.newPassword;
  const id: number = user.id;
  validateUserPassword(
    user.username,
    oldPassword,
    function (validated: boolean, error: string | null) {
      if (error) {
        return res.status(500).json({ password: error });
      } else if (validated) {
        bcrypt.hash(newPassword, 15).then((hash) => {
          db.run(
            "UPDATE users SET hash = ? WHERE id = ?",
            [hash, id],
            function (error: Error) {
              if (error) {
                res.status(500).json({
                  newPassword:
                    "Something went wrong while trying to update the user password.",
                });
              } else {
                  removeRefreshToken(req, res)
                  res.status(200).json({ updated: true })
                }
            },
          );
        });
      } else {
        res.status(400).json({ password: "Given password is not correct!" });
      }
    },
  );
}

function loginUser(req: any, res: any) {
  const { username, password } = req.body;
  checkForUsernameExistence(
    username,
    function (exists: boolean, message: string | null) {
      if (message) {
        return res.status(500).json({ username: message });
      } else if (exists) {
        validateUserPassword(
          username,
          password,
          function (validated: boolean, error: string | null, user?: User) {
            if (error) {
              return res.status(500).json({ password: error });
            } else if (validated) {
              const refreshToken = createRefreshToken(user as User); // maak refresh en acces tokens aan
              const accessToken = createAccesToken(user as User);

              res.cookie("refresh-token", refreshToken, {
                expires: new Date(Date.now() + daysToMilliseconds(1)), // 1 dag
                httpOnly: false, // temporary false. update later
              });
            
              res.cookie("access-token", accessToken, {
                expires: new Date(Date.now() + minutsToMilliseconds(0.5)), // 15 min
                httpOnly: false, // temporary false. update later
              });

              res.status(200).json({
                authenticated: true,
                username: username,
                id: (user as User).id,
              });
            } else {
              res.status(400).json({ password: "Password is not correct!" });
            }
          },
        );
      } else {
        return res.status(400).json({ username: "Username does not exist" });
      }
    },
  );
}

// als de user uitlogt, tokens verwijderen
function logoutUser(req: any, res: any) {
  console.log("logout");
removeRefreshToken(req, res);
res.status(200).json({ success: true, message: 'User logged out successfully' });
}

function getEmail(req: any, res: any) {
  const user: User = (req as any).user;
  const userid = user.id;
  db.get(
    "SELECT * FROM users WHERE id = ?",
    [userid],
    (err: Error, result: any) => {
      if (err) {
        return res.status(400).json({
          error:
            "something went wrong while trying to get the user information.",
        });
      }
      if (result) {
        res.status(200).json({ email: result.email });
      } else {
        res.status(400).json({
          error:
            "User is not found. Are you sure you're registered and logged in?",
        });
      }
    },
  );
}

function updateUsername(req: any, res: any) {
  const user: User = (req as any).user;
  const userid: number = user.id;
  const newUsername: string = (req as any).body.username;
  if (!newUsername) {
    return res.status(400).json({
      username: "No username provided",
    });
  }
  checkForUsernameExistence(
    newUsername,
    function (exists: boolean, message: string | null) {
      if (message) {
        res.status(400).json({ username: message });
      } else if (exists) {
        res.status(400).json({ username: "username already exists." });
      } else {
        db.run("UPDATE users SET username = ? WHERE id = ?", [
          newUsername,
          userid,
        ], function (error: Error) {
          if (error) {
            res.status(400).json({
              username:
                "Something went wrong while trying to update the username.",
            });
          } else {
            user.username = newUsername
            
            const refreshToken = req.cookies["refresh-token"]
            removeToken(refreshToken);

            const newRefreshToken = createRefreshToken(user);
            const accessToken = createAccesToken(user);
  
            res.cookie("refresh-token", newRefreshToken, {
              expires: new Date(Date.now() + daysToMilliseconds(1)), // 1 dag
              httpOnly: false, // temporary false. update later
            });
          
            res.cookie("access-token", accessToken, {
              expires: new Date(Date.now() + minutsToMilliseconds(15)), // 15 min
              httpOnly: false, // temporary false. update later
            });
            res.status(200).json({ updated: true });
          }
        });
      }
    },
  );
}

function updateEmail(req: any, res: any) {
  const user: User = req.user;
  const userid: number = user.id;
  const newEmail: string = (req as any).body.newEmail;

  if (!newEmail) {
    return res.status(400).json({ newEmail: "No email provided" });
  }
  checkForEmailExistence(newEmail, function (error: any) {
    if (error) {
      res.status(400).json({ newEmail: error });
    } else {
      db.run(
        "UPDATE users set email = ? WHERE id = ?",
        [newEmail, userid],
        function (error: Error) {
          if (error) {
            res.status(400).json({
              newEmail: "Something went wrong while updating the user email.",
            });
          } else {
            res.status(200).json({ updated: true });
          }
        },
      );
    }
  });
}

function addAvatar(req: any, res: any) {
  if (!req.file) {
    return res.status(400).json({ avatar: "please provide a file" });
  } else {
    const user: User = req.user;
    const userid: number = user.id;
    const { originalname, mimetype, buffer } = req.file;
    db.run(
      "INSERT INTO avatars (id, filename, type, content) VALUES(?, ?, ?, ?)",
      [userid, originalname, mimetype, buffer],
      function (error: Error) {
        if (error) {
          res.status(400).json({
            avatar: "Something went wrong while uploading the user avatar.",
          });
        } else {[
            res.status(200).json({ added: true }),
          ];}
      },
    );
  }
}

function getAvatar(req: any, res: any) {
  const userid: number = req.params.id;
  db.get(
    "SELECT * FROM avatars WHERE id = ?",
    [userid],
    (err: Error, result: any) => {
      if (err) {
        return res.status(500).json({
          error: "Something went wrong while getting the user avatar.",
        });
      }
      if (result) {
        res.set("Content-Type", result.type);
        res.status(200).send(result.content);
      } else {
        res.status(404).json({
          error:
            "Avatar for this user is not found.",
        });
      }
    },
  );
}


function getUserName(req: any, res: any) {
  const id = parseInt(req.params.id);
  if(isNaN(id) || id < 0) {
    return res.status(400).json({error: "id required to be a number higher than 0"})
  }
  db.get(
    "SELECT * FROM users WHERE id = ?",
    id,
    function (error, result) {
      if (error) {
        res.status(500).json({
          username: "Something went wrong when trying to get the username.",
        });
      } else if (result) {
        res.status(200).json({ username: result.username });
      } else {
        res.status(404).json({ username: "username is not found." });
      }
    },
  );
}

/* change the avatar of the user
 *
*/
function updateAvatar(req: any, res: any) {
  const user: User = req.user;
  const userid: number = user.id;
  const { originalname, mimetype, buffer } = req.file;
  db.run(
    "UPDATE avatars set filename = ?, type = ?, content = ? WHERE id = ?",
    [originalname, mimetype, buffer, userid],
    function (error: Error) {
      if (error) {
        res.status(400).json({
          avatar: "Something went wrong when inserting the avatar.",
        });
      } else {
        res.status(200).json({ updated: true });
      }
    },
  );
}

/* Check first if there is an avatar. If there is, update the old one. */
function setAvatar(req: any, res: any) {
  const user: User = req.user;
  const userid: number = user.id;
  checkForUserAvatar(userid, (error, result) => {
    if (error) {
      res.status(400).json({ avatar: error });
    } else if (result) {
      updateAvatar(req, res);
    } else {
      addAvatar(req, res);
    }
  });
}

function checkIfAvatarExists(req: any, res: any) {
  const id : number = parseInt(req.params.id)
  checkForUserAvatar(id, function (error, result) {
    if(error) {
      return res.status(500).json({error: error})
    }else {
      return res.status(200).json({avatar: result})
    }
  })
}

/* Delete the user from the database */
function deleteUser(req: any, res: any) {
  const userid: number = req.user.id;
  db.run("DELETE FROM users WHERE id = ?", [userid], function (error) {
    if (error) {
      res.status(400).json({
        error: "something went wrong while deleting the user account",
      });
    }
  });
  db.run("DELETE FROM avatars WHERE id = ?", [userid], function (error) {
    if (error) {
      res.status(400).json({
        error: "something went wrong while deleting the user avatar.",
      });
    }
  });
}

export {
  addAvatar,
  ChangePassword,
  deleteUser,
  getAvatar,
  getUserName,
  loginUser,
  logoutUser,
  registerNewUser,
  getEmail,
  setAvatar,
  updateAvatar,
  updateEmail,
  updateUsername,
  checkIfAvatarExists
};
