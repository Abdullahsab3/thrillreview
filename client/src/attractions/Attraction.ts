import Axios from "axios";
import { backendServer } from "../helpers";

class Attraction {
    name: string;
    themepark: string;
    themeparkID: number;
    openingdate: string;
    builder: string;
    type: string;
    height: string;
    length: string;
    inversions: string;
    duration: string;
    id: number;
    
    constructor(name: string, themapark: string, themeparkID: number, opingdate: string, builder: string, type: string, 
                height: string, lenght: string, inversions: string, duration: string, id: number) {
        this.name = name;
        this.themepark = themapark;
        this.themeparkID = themeparkID;
        this.openingdate = opingdate;
        this.builder = builder;
        this.type = type;
        this.height = height;
        this.length = lenght;
        this.inversions = inversions;
        this.duration = duration;
        this.id = id;
    }

    toJSON(): any {
        const jsonObj: any = {"name": this.name, "themepark": this.themepark, "themeparkID" : this.themeparkID, "id": this.id}
        if(this.openingdate) {
            jsonObj.openingdate = this.openingdate
        }
        if(this.builder) {
            jsonObj.builder = this.builder
        }
        if(this.type) {
            jsonObj.type = this.type
        }
        /**
         * These are converted to strings, as the server is expecting strings.
         */
        if(this.height) {
            jsonObj.height = this.height.toString()
        }
        if(this.length) {
            jsonObj.length = this.length.toString()
        }
        if(this.inversions) {
            jsonObj.inversions = this.inversions.toString()
        }
        if(this.duration) {
            jsonObj.duration = this.duration
        }
        return jsonObj
    }
    
}

async function getAttractionName(
    id: number,
    getRes: (error: string | null, username: string | null) => void,
  ) {
    Axios.get(backendServer(`/attraction/${id}/name`)).then((res) => {
      getRes(null, res.data.name);
    }).catch(function (error) {
      getRes(error.response.data.error, null);
    });
  }

function getAttractionRating(id: number, getRating: (rating: number, total: number, error: string) => void) {
    Axios.get(backendServer(`/attraction/${id}/rating`)).then((res) => {
        getRating(res.data.rating, res.data.ratingCount, "");
    }).catch(function (error: any) {
        getRating(0, 0, error.reponse.data)
    })

}

export {Attraction, getAttractionName, getAttractionRating };