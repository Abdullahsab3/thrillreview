export class AttractionPreview {
  name: string;
  id: number;
  userID: number;
  themepark: string;

  constructor(name: string, id: number, userID: number, themepark: string) {
    this.name = name;
    this.id = id;
    this.userID = userID;
    this.themepark = themepark;
  }
  toJSON() {
    return {
    "type": "attraction",
      "name": this.name,
      "id": this.id,
      "userID": this.userID,
      "themepark": this.themepark,
    };
  }
}

export class ThemeParkPreview {
  name: string;
  country: string;
  id: number;
  userID: number;

  constructor(name: string, country: string, id: number, userID: number) {
    this.name = name;
    this.id = id;
    this.country = country
    this.userID = userID;
  }

  toJSON() {
    return ({"type": "themepark", "name": this.name, "country": this.country, "id": this.id, "userID": this.userID });
  }
}
