import { ThemePark } from "./ThemePark";
import { db, getThemePark, getLastId } from "./database";
import { User } from "./User";
import axios from 'axios';

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
    let lat = 0;
    let long = 0;
    const userid = req.user.id;
    const nominatimUrl=`https://nominatim.openstreetmap.org/search?street=${streetNumber}%20${street.replaceAll(' ', '%20')}&postalcode=${postalCode}&&format=json`;
    axios.get(nominatimUrl).then(async nominatimres => {
        const data = nominatimres.data;
        if (data === undefined || data.length === 0) {
            return res.status(418).json({ error: "not found" });
        } else {
            lat = data[0].lat;
            long = data[0].lon;
            db.run(
                "INSERT INTO themeparks (userID, name, street, streetnumber, postalcode, country, lat, long) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
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
                (error: Error) => {
                    if (error) {
                        return res.status(400).json({ error: error.message });
                    } else {
                        return res.json({ added: true});
                    }
                },
            );
        }
        const lastid = await getLastId()
        console.log(lastid)
        if (openingsdate){
          db.run(
            "INSERT INTO themeparksopening (id, opening) VALUES(?, ?)",
            [
              lastid,
              openingsdate
            ]
          )
        }
        if (type){
          db.run(
            "INSERT INTO themeparkstype (id, type) VALUES(?, ?)",
            [
              lastid,
              type
            ]
          )
        }
        if (website){
          db.run(
            "INSERT INTO themeparkswebsite (id, website) VALUES(?, ?)",
            [
              lastid,
              website
            ]
          )
        }
    }) 
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
    lat,
    long,
    type,
    website,
} = req.body;
  db.run(
    "UPDATE attractions SET name = ?, openingsdate = ?, street = ?, streetnumber = ?, postalcode = ?, country = ?, lat = ?, long = ?, type = ? website = ? WHERE id = ?",
    [
      name,
      openingsdate,
      street,
      streetNumber,
      postalCode,
      country,
      lat,
      long,
      type,
      website,
      themeparkID,
    ], function (error) {
      if(error) {
        res.status(400).json({error: "Something went wrong while trying to update the themepark information"})
      }
    })
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

export {
    addThemePark,
    findThemeParkByID,
    editThemePark
}