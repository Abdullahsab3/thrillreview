import { daysToMilliseconds, minutsToMilliseconds } from "./helpers";
import { User } from "./User";
import {
  checkForEmailExistence,
  checkForUserAvatar,
  checkForUserExistence,
  checkForUsernameExistence,
  removeToken,
  db,
  validateUserPassword,
} from "./database";
import bcrypt from "bcrypt";
import { createRefreshToken, removeRefreshToken, createAccesToken } from "./JWT";

function registerNewUser(req: any, res: any) {
  const { username, email, password } = req.body;
  checkForUsernameExistence(
    username,
    function (exists: boolean, message: string | null) {
      if (message) {
        res.status(400).json({ username: message });
      } else if (exists) {
        res.status(400).json({ username: "username is already used" });
      } else {
        checkForEmailExistence(email, function (error) {
          if (error) {
            res.status(400).json({ email: error });
          } else {
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
                    return res.status(400).json(
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
        return res.status(401).json({ password: error });
      } else if (validated) {
        bcrypt.hash(newPassword, 15).then((hash) => {
          db.run(
            "UPDATE users SET hash = ? WHERE id = ?",
            [hash, id],
            function (error: Error) {
              if (error) {
                res.status(400).json({
                  newPassword:
                    "Something went wrong while trying to update the user password.",
                });
              } else {[
                  /* TODO: zorg ervoor dat de gebruiker afgemeld wordt en dat een
                    token gegenereerd moet worden.
                */
                  res.status(200).json({ updated: true }),
                ];}
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
        return res.status(400).json({ username: message });
      } else if (exists) {
        validateUserPassword(
          username,
          password,
          function (validated: boolean, error: string | null, user?: User) {
            if (error) {
              return res.status(400).json({ password: error });
            } else if (validated) {
              const refreshToken = createRefreshToken(user as User);
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

function logoutUser(req: any, res: any) {
  console.log("logout");
removeRefreshToken(req, res);
res.status(200).json({ success: true, message: 'User logged out successfully' });
}

function sendProfileInformation(req: any, res: any) {
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
        // hier kan je informatie over de profiel sturen naar de client
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
        return res.status(400).json({
          error: "Something went wrong while getting the user avatar.",
        });
      }
      if (result) {
        res.set("Content-Type", result.type);
        // hier kan je informatie over de profiel sturen naar de client
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
  const id = req.params.id;
  db.get(
    "SELECT * FROM users WHERE id = ?",
    id,
    function (error, result) {
      if (error) {
        res.status(400).json({
          username: "Something went wrong when trying to get the username.",
        });
      } else if (result) {
        res.status(200).json({ username: result.username });
      } else {
        res.status(400).json({ username: "username is not found." });
      }
    },
  );
}

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
  sendProfileInformation,
  setAvatar,
  updateAvatar,
  updateEmail,
  updateUsername,
};
