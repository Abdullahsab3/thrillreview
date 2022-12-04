import { ThemePark } from "./ThemePark";
import { db } from "./database";
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
    axios.get(nominatimUrl).then(nominatimres => {
        const data = nominatimres.data;
        if (data === undefined || data.length === 0) {
            return res.status(418).json({ error: "not found" });
        } else {
            lat = data[0].lat;
            long = data[0].lon;
            db.run(
                "INSERT INTO themeparks (userID, name, openingsdate, street, streetnumber, postalcode, country, lat, long, type, website) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    userid,
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
    }) 
}

export {
    addThemePark
}