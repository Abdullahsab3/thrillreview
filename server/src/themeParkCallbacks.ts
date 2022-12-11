import { ThemePark } from "./ThemePark";
import { db, getLastId, getThemePark, getThemeParksInCoordinatesRange } from "./database";
import { User } from "./User";
import axios from "axios";

function getLocationCoordinates(
  street: string,
  streetNumber: number,
  postalCode: number,
  getResult: (
    error: string | null,
    lat: number | null,
    long: number | null,
  ) => void,
) {
  const nominatimUrl =
    `https://nominatim.openstreetmap.org/search?street=${streetNumber}%20${
      street.replaceAll(" ", "%20")
    }&postalcode=${postalCode}&&format=json`;
  axios.get(nominatimUrl).then(async (nominatimres) => {
    const data = nominatimres.data;
    if (data === undefined || data.length === 0) {
      getResult("Coordinates for this location are not found", null, null);
    } else {
      getResult(null, data[0].lat, data[0].long);
    }
  });
}
function addThemePark(req: any, res: any) {
  const {
    name,
    openingsdate,
    street,
    streetNumber,
    postalCode,
    country,
    type,
    website,
  } = req.body;
  const userid = req.user.id;
  getLocationCoordinates(
    street,
    streetNumber,
    postalCode,
    function (error, lat, long) {
      if (error) {
        return res.status(418).json({ error: error });
      } else {
        db.get(
          "INSERT INTO themeparks (userID, name, street, streetnumber, postalcode, country, lat, long) VALUES(?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
          [
            userid,
            name,
            street,
            streetNumber,
            postalCode,
            country,
            lat,
            long,
          ],
          (error: Error, result: any) => {
            if (error) {
              return res.status(400).json({ error: error.message });
            } else {
              if (result) {
                const lastid = result.id;
                if (openingsdate) {
                  db.run(
                    "INSERT INTO themeparksopening (id, opening) VALUES(?, ?)",
                    [
                      lastid,
                      openingsdate,
                    ],
                  );
                }
                if (type) {
                  db.run(
                    "INSERT INTO themeparkstype (id, type) VALUES(?, ?)",
                    [
                      lastid,
                      type,
                    ],
                  );
                }
                if (website) {
                  db.run(
                    "INSERT INTO themeparkswebsite (id, website) VALUES(?, ?)",
                    [
                      lastid,
                      website,
                    ],
                  );
                }
              }
              return res.json({ added: true });
            }
          },
        );
      }
    },
  );
}

function editThemePark(req: any, res: any) {
  const themeparkID = parseInt(req.params.themeparkID);
  const {
    name,
    openingsdate,
    street,
    streetNumber,
    postalCode,
    country,
    type,
    website,
  } = req.body;
  const userid = req.user.id;
  getLocationCoordinates(
    street,
    streetNumber,
    postalCode,
    function (error, lat, long) {
      if (error) {
        return res.status(418).json({ error: error });
      } else {
        db.run(
          // name, street, streetnumber, postalcode, country, lat, long
          "UPDATE themeparks SET userID = ?, name = ?, street = ?, streetnumber = ?, postalcode = ?, country = ?, lat = ?, long = ? WHERE id = ?",
          [
            userid,
            name,
            street,
            streetNumber,
            postalCode,
            country,
            lat,
            long,
            themeparkID,
          ],
          function (error) {
            if (error) {
              res.status(400).json({
                error:
                  "Something went wrong while trying to update the themepark information",
              });
            } else {
              if (openingsdate) {
                db.run(
                  "UPDATE themeparksopening SET  opening = ? WHERE id = ?",
                  [
                    openingsdate,
                    themeparkID,
                  ],
                );
              }
              if (type) {
                db.run(
                  "UPDATE themeparkstype SET type = ? WHERE id = ?",
                  [
                    type,
                    themeparkID,
                  ],
                );
              }
              if (website) {
                db.run(
                  "UPDATE themeparkswebsite SET website = ? WHERE id = ?",
                  [
                    website,
                    themeparkID,
                  ],
                );
              }
            }
          },
        );
      }
    },
  );
}

function findThemeParkByID(req: any, res: any) {
  const id = req.params.themeparkID;
  getThemePark(id, function (error: any, attraction: ThemePark | null) {
    if (error) {
      return res.status(400).json({ error: error });
    }
    if (attraction) {
      return res.status(200).json(attraction.toJSON());
    } else {
      return res.status(400).json({
        attractionID: "No attraction found with the given ID",
      });
    }
  });
}

function findThemeParksInCoordinatesRange(req: any, res: any) {
  const {
    minLat,
    maxLat,
    minLong,
    maxLong
  } = req.params;
  getThemeParksInCoordinatesRange(minLat, maxLat, minLong, maxLong, 
    function (error: any, results: any | null) {
      if (error) {
        return res.status(400).json({ error: error });
      }
      if (results) {
        return res.status(200).json({ results: results });
      } else {
        return res.status(400).json({ results: "no themeparks in this range"});

      }
    });

}

export { addThemePark, editThemePark, findThemeParkByID, findThemeParksInCoordinatesRange };
