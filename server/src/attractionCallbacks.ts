import { Attraction } from "./Attraction";
import { db } from "./database";

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

export{addAttraction};