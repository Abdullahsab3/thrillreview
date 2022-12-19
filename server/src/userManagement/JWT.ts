import { daysToMilliseconds, minutsToMilliseconds } from "../helpers";
import { Secret, sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "./User";
import { addToken, removeToken, checkForTokenExistence } from "../database"

// geen idee wat ik hiervan moet maken voorlopig
const accesSecret: Secret = "RGosJBIo2arhXnHZRdC3r5fDeL7Rrf+dxBm+53LzKMv4viRVXL92XCdZa1hDHpszakyetIuDMIeEBShKAW1tpQ==";
const refreshSecret: Secret = "dOCemKfBhJgu0zinjg+TsAylLvpf5kaq34qEs6jVYDPa+we1G7kk9QfHXYh7aJYNKRVR/1+SEfsHU89ej+ThDA==";

function createRefreshToken(user: User) {
  const refreshToken = sign({ username: user.username, id: user.id }, refreshSecret, { expiresIn: '1d'});
  addToken(refreshToken);
  return refreshToken
}

// verwijderd de refreshtoken uit de db en stuurt lege cookies naar de user zodat deze verwijderd worden
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

// make a new access token
function createAccessToken(user: User) {
  return sign({ username: user.username, id: user.id }, accesSecret , { expiresIn: '15m'} );
}

  
// valideerd de tokens van de user, indien alles inorde is roept hij next op
function validateTokens(req: Request, res: Response, next: Function) {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"]

  if (!accessToken) {// indien accestoken vervallen is checken of refreschtoken nog geldig is
    if(refreshToken){ 
      checkForTokenExistence(refreshToken, (existance: Boolean) => {
        if (existance){ // kijkt of de refreschtoken nog in de db zit
          verify(refreshToken, refreshSecret, (err: any, info: any) => { //controleert de geldigheid van de token
          if(err) {
            removeToken(refreshToken); //indien niet meer geldig verwijder uit db
            return res.status(400).json({error: "refresh-token is not valid"})
          } else {
            removeToken(refreshToken); //indien de token geldig verwijder uit de db (voor aanmaak nieuwe)
  
            const user: User = new User(info.username, info.id);
            const newRefreshToken = createRefreshToken(user); // maak nieuwe refreschtoken
            const accessToken = createAccessToken(user); // maak nieuwe accestoken
  
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
  } else { // indien er een accestoken is, verifieer en voer next uit indien geldig
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
export { createRefreshToken, removeRefreshToken, createAccessToken, validateTokens, };
