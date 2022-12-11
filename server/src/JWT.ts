import { daysToMilliseconds, minutsToMilliseconds } from "./helpers";
import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "./User";
import { addToken, removeToken, checkForTokenExistence } from "./database"

// geen idee wat ik hiervan moet maken voorlopig
const accesSecret: Secret = "RGosJBIo2arhXnHZRdC3r5fDeL7Rrf+dxBm+53LzKMv4viRVXL92XCdZa1hDHpszakyetIuDMIeEBShKAW1tpQ==";
const refreshSecret: Secret = "dOCemKfBhJgu0zinjg+TsAylLvpf5kaq34qEs6jVYDPa+we1G7kk9QfHXYh7aJYNKRVR/1+SEfsHU89ej+ThDA==";

function createRefreshToken(user: User) {
  const refreshToken = sign({ username: user.username, id: user.id }, refreshSecret, { expiresIn: '1d'});
  addToken(refreshToken);
  return refreshToken
}


function removeRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies["refresh-token"]
  removeToken(refreshToken);
  res.cookie("refresh-token", 'none', {
    expires: new Date(Date.now() + 1000), // 1 sec
    httpOnly: false,
  });
  res.cookie("access-token", 'none', {
    expires: new Date(Date.now() + 1000), // 1 sec
    httpOnly: false,
  });
}

function createAccesToken(user: User) {
  return sign({ username: user.username, id: user.id }, accesSecret , { expiresIn: '15m'} );
}

  
function validateTokens(req: Request, res: Response, next: Function) {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"]

  if (!accessToken) {
    if(refreshToken){ 
      checkForTokenExistence(refreshToken, (existance: Boolean) => {
        if (existance){
          verify(refreshToken, refreshSecret, (err: any, info: any) => {
          if(err) {
            removeToken(refreshToken);
            return res.status(400).json({error: "refresh-token is not valid"})
          } else {
            removeToken(refreshToken);
  
            const user: User = new User(info.username, info.id);
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
            (req as any).user = user;
            next();
        }
      })
        }
      })
      
    }else{
      return res.status(400)
      .json({ error: "user not authenticated!" });
    }
  } else {
  verify(accessToken, accesSecret, (err: any, info: any) => {
    if(err) {
      return res.status(400).json({error: "token is not valid"})
    } else {
      const user: User = new User(info.username, info.id);
      (req as any).user = user;
      next();
  }
})
}
}
export { createRefreshToken, removeRefreshToken, createAccesToken, validateTokens, };
