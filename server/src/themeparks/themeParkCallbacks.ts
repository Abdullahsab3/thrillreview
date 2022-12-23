import { ThemePark } from "./ThemePark";
import { db, getThemePark, getThemeParksByName } from "../database";
import axios from "axios";

// geeft de coordinaten terug gegeven een adres
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
      getResult(null, data[0].lat, data[0].lon);
    }
  });
}

/**
 * Validate all the input when adding or modifying a theme park
 * @param input the input fields
 * @param getResult the callback to retrieve the results.
 */
function checkThemeParkInformation(input: any): string {
  const {
    name,
    openingdate,
    type,
    website,
  } = input;

  if(!name || typeof name != 'string'){
    return("name must be provided")
  }
  if(openingdate && typeof openingdate != 'string'){
    return("opening not valid")
  }
  if(type &&  typeof type != 'string'){
    return("type not valid")
  }
  if(website &&  typeof website != 'string'){
    return("website not valid")
  }
  return("")

}
// voegt een themepark toe
function addThemePark(req: any, res: any) {

  const userid = req.user.id;
  const validationError = checkThemeParkInformation(req.body)
  if(validationError) {
    return res.status(400).json({error: validationError})
  }
    const {
      name,
      openingdate,
      street,
      streetNumber,
      postalCode,
      country,
      type,
      website,
    } = req.body;

    getLocationCoordinates( // coordinaten opvragen
    street,
    streetNumber,
    postalCode,
    function (error, lat, long) {
      if (error) {
        return res.status(418).json({ error: error }); // indien adress niet bestaat error terug geven
      } else {
        // eerst alle verplichte info toevoegen
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
                const lastid = result.id; // id nodig voor linken aan themepark (normalisatie van db)
                // indien info bestaat, toevoegen aan db
                if (openingdate) {
                  db.run(
                    "INSERT INTO themeparksopening (id, opening) VALUES(?, ?)",
                    [
                      lastid,
                      openingdate,
                    ],
                  );
                }
                if (type) {
                  db.run(
                    "INSERT INTO themeparkstype (id, type) VALUES(?, ?)",
                    [
                      lastid,
                      type,
                    ], function (error) {
                    }
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
  if(isNaN(themeparkID)) {
    return res.status(400).json({error: "Theme park ID required"})
  }
  const validationError = checkThemeParkInformation(req.body)
  if(validationError) {
    return res.status(400).json({error: validationError})
  }
    getThemePark(themeparkID, function (error, result) {
      if(error) {
        return res.status(400).json({error: error})
      }

      const {
        name,
        openingdate,
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
                  if (openingdate) {
                    db.run(
                      "REPLACE INTO themeparksopening (id, opening) VALUES(?, ?)",
                      [
                        themeparkID,
                        openingdate,
                      ],
                    );
                  }
                  if (type) {
                    db.run(
                      "REPLACE INTO themeparkstype (id, type) VALUES(?, ?)",
                      [
                        themeparkID,
                        type,
                        
                      ],
                    );
                  }
                  if (website) {
                    db.run(
                      "REPLACE INTO themeparkswebsite (id, website) VALUES(?, ?)",
                      [
                        themeparkID,
                        website,
                        
                      ],
                    );
                  }
                  return(res.status(200).json({updated: true}))
                }
              },
            );
          }
        },
      );
    })
  }

function findThemeParkByID(req: any, res: any) {
  const id = parseInt(req.params.themeparkID);

  if(isNaN(id)) {
    return res.status(400).json({themeparkID: "The id of the themepark is required"})
  }
  getThemePark(id, function (error: any, themepark: ThemePark | null) {
    if (error) {
      return res.status(500).json({ error: error });
    }
    if (themepark) {
      return res.status(200).json(themepark.toJSON());
    } else {
      return res.status(404).json({
        themeparkID: "No themepark found with the given ID",
      });
    }
  });
}

//seerch voor themeparks
function findThemeParkByName(req: any, res: any) {
  var themeParkName = req.query.query;
  var page = parseInt(req.query.page);
  var limit = parseInt(req.query.limit);
  if (!themeParkName) { // indien geen query, zoeken op lege string wat wildcard is
    themeParkName = "";
  }
  if (isNaN(page)) { //indien geen page pagina 0 kiezen wat dezelfde als pagina 1 is
    page = 0;
  }
  if (isNaN(limit)) { // indien geen limiet, stel limiet in op 0, wat alles terug geeft
    limit = 0;
  }
  getThemeParksByName(themeParkName, page, limit, function (error, result) {
    if (error) {
      res.status(400).json({error: error});
    } else if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({themeparks: "No themeparks found" });
    }
  });
}

export { addThemePark, editThemePark, findThemeParkByID, findThemeParkByName };
