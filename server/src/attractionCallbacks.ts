import { Attraction } from "./Attraction";
import { db, getAttraction } from "./database";

function addAttraction(req: any, res: any) {
    const { name, themepark, opening, Builder, type, length, height, inversions, duration,} = req.body;
    db.run("INSERT INTO attractions (name, themepark, opening, Builder, type, length, height, inversions, duration) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        name, 
        themepark, 
        opening, 
        Builder, 
        type, 
        length, 
        height, 
        inversions, 
        duration
      ], (error: Error) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        } else {
          return res.json({ registered: true });
        }
      });
}

function findAttractionById(req: any, res: any) {
  const id = req.body.attractionID
  getAttraction(id, function (error: any, attraction: Attraction | null) {
    if(error) {
      return res.status(400).json(error)
    }
    if(attraction) {
      return res.status(200).json(attraction.toJSON())
    } else {
      return res.status(200).json({error: true, attractionID: "No attraction found with the given ID"})
    }
  })
}

export{addAttraction, findAttractionById};