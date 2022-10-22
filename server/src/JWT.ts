import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";

// geen idee wat ik hiervan moet maken voorlopig
const secret: Secret = "sxvQU2HK8x";

function createTokens(user: any) {
  const accessToken = sign({ username: user.username, id: user.id }, secret);

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

  try {
    const validToken = verify(accessToken, secret);

    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
}
export { createTokens, validateTokens };
