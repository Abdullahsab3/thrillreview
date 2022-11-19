import { daysToMilliseconds } from "./helpers";
import { User } from "./User";
import {
  checkForEmailExistence,
  checkForUserExistence,
  checkForUsernameExistence,
  db,
  validateUserPassword,
} from "./database";
import bcrypt from "bcrypt";
import { createTokens } from "./JWT";

function registerNewUser(req: any, res: any) {
  const { username, email, password } = req.body;
  checkForUserExistence(username, email, function (error: string | null) {
    if (error) {
      res.status(400).json(error);
    } else {
      // hashing factor = 15
      bcrypt.hash(password, 15).then((hash) => {
        db.run("INSERT INTO users (username, email, hash) VALUES(? , ?, ?)", [
          username,
          email,
          hash,
        ], (error: Error) => {
          if (error) {
            return res.status(400).json({
              error: true,
              username: error.message,
            });
          } else {
            return res.json({ error: false });
          }
        });
      });
    }
  });
}

function ChangePassword(req: any, res: any) {
  const user: User = req.user;
  const oldPassword: string = req.body.password;
  const newPassword: string = req.body.newPassword;
  const id: number = user.id;

  validateUserPassword(
    user.username,
    oldPassword,
    function (error: any, validatedUser: User | null) {
      if (error) {
        return res.status(401).json(error);
      } else if (validatedUser) {
        bcrypt.hash(newPassword, 15).then((hash) => {
          db.run(
            "UPDATE users SET hash = ? WHERE id = ?",
            [hash, id],
            function (error: Error) {
              if (error) {
                res.status(400).json({ error: true, password: error.message });
              } else {[
                  /* TODO: zorg ervoor dat de gebruiker afgemeld wordt en dat een
                    token gegenereerd moet worden.
                */
                  res.status(200).json({ error: false }),
                ];}
            },
          );
        });
      }
    },
  );
}

function loginUser(req: any, res: any) {
  const { username, password } = req.body;
  validateUserPassword(
    username,
    password,
    function (error: any, user: User | null) {
      if (error) {
        return res.status(400).json(error);
      } else {
        const accessToken = createTokens(user as User);

        res.cookie("access-token", accessToken, {
          maxAge: daysToMilliseconds(30),
          httpOnly: false, // temporary false. update later
        });

        res.json({ error: false, username: username, id: (user as User).id });
      }
    },
  );
}

function sendProfileInformation(req: any, res: any) {
  const user: User = (req as any).user;
  // reverted due to severe vulnaribility issues
  const userid = user.id;
  db.get(
    "SELECT * FROM users WHERE id = ?",
    [userid],
    (err: Error, result: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (result) {
        // hier kan je informatie over de profiel sturen naar de client
        res.status(200).json({ email: result.email });
      } else {
        res.status(400).json({ error: "Something went wrong." });
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
      error: true,
      username: "No username provided",
    });
  }
  checkForUsernameExistence(newUsername, function (error: any) {
    if (error) {
      res.status(400).json(error);
    } else {
      db.run("UPDATE users SET username = ? WHERE id = ?", [
        newUsername,
        userid,
      ], function (error: Error) {
        if (error) {
          res.status(400).json({ error: true, username: error.message });
        } else {
          res.status(200).json({ error: false });
        }
      });
    }
  });
}

function updateEmail(req: any, res: any) {
  const user: User = req.user;
  const userid: number = user.id;
  const newEmail: string = (req as any).body.newEmail;

  if (!newEmail) {
    return res.status(400).json({ error: true, newEmail: "No email provided" });
  }
  checkForEmailExistence(newEmail, function (error: any) {
    if (error) {
      res.status(400).json(error);
    } else {
      db.run(
        "UPDATE users set email = ? WHERE id = ?",
        [newEmail, userid],
        function (error: Error) {
          if (error) {
            res.status(400).json({ error: true, newEmail: error.message });
          } else {
            res.status(200).json({ error: false });
          }
        },
      );
    }
  });
}

function addAvatar(req: any, res: any) {
  if (!req.file) {
    return res.status(400).json({ error: true, file: "please provide a file" });
  } else {
    const user: User = req.user;
    const userid: number = user.id;
    const { originalname, mimetype, buffer } = req.file;
    db.run(
      "INSERT INTO avatars (id, filename, type, content) VALUES(?, ?, ?, ?)",
      [userid, originalname, mimetype, buffer],
      function (error: Error) {
        if (error) {
          res.status(400).json({ error: true, file: error.message });
        } else {[
            res.status(200).json({ error: false }),
          ];}
      },
    );
  }
}

function getAvatar(req: any, res: any) {
  const user: User = req.user;
  const userid: number = user.id;
  db.get(
    "SELECT * FROM avatars WHERE id = ?",
    [userid],
    (err: Error, result: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (result) {
        res.set("Content-Type", result.type);
        // hier kan je informatie over de profiel sturen naar de client
        res.status(200).send(result.content);
      } else {
        res.status(400).json({ error: "Something went wrong." });
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
        res.status(400).json({ error: true, file: error.message});
      } else {
        res.status(200).json({ error: false });
      }
    },
  );
}

export {
  addAvatar,
  updateAvatar,
  ChangePassword,
  getAvatar,
  loginUser,
  registerNewUser,
  sendProfileInformation,
  updateEmail,
  updateUsername,
};
