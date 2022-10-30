import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";

// geen idee wat ik hiervan moet maken voorlopig
const secret: Secret = "sxvQU2HK8x";

function createTokens(user: any) {
  const accessToken = sign({ username: user.username, id: user.id }, secret) /*, {expiresIn: "15m"});*/

  return accessToken;
}

declare global {
    namespace Express {
        interface Request {
              authenticated?: boolean;
      }
    }
  }

  
function validateTokens(req: Request, res: Response, next: Function) {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(400)
      .json({ error: "user not authenticated!" });
  }
  verify(accessToken, secret, (err: any, user: any) => {
    if(err) {
      return res.status(400).json("token is not valid")
    }

    (req as any).user = user
    next();
  })
}
export { createTokens, validateTokens };
