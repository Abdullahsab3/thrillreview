import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "./User";

// geen idee wat ik hiervan moet maken voorlopig
const secret: Secret = "sxvQU2HK8x";

function createTokens(user: User) {
  const accessToken = sign({ username: user.username, id: user.id }, secret) /*, {expiresIn: "15m"});*/

  return accessToken;
}

  
function validateTokens(req: Request, res: Response, next: Function) {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(400)
      .json({ error: "user not authenticated!" });
  }
  verify(accessToken, secret, (err: any, info: any) => {
    if(err) {
      return res.status(400).json({error: "token is not valid"})
    } else {
      const user: User = new User(info.username, info.id);
      (req as any).user = user;
      next();
  }
})
}
export { createTokens, validateTokens };
