import { ThemePark } from "./ThemePark";
import { db } from "./database";
import { User } from "./User";

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
    const userid = req.user.id
    console.log("add-themepark");
    db.run(
        "INSERT INTO themeparks (userID, name, openingsdate, street, streetnumber, postalcode, country, type, website) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            userid,
            name,
            openingsdate,
            street,
            streetNumber,
            postalCode,
            country,
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

export {
    addThemePark
}