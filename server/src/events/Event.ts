class Event {
    name: string;
    themepark: string;
    themeparkID: number;
    date: string;
    hour: string;
    description: string;
    id: number;
    userID: number;
    
    constructor(name: string, themapark: string, themeparkID: number, date: string, hour: string, description: string, id: number, userID: number) {
        this.name = name;
        this.themepark = themapark;
        this.themeparkID = themeparkID;
        this.date = date;
        this.hour = hour;
        this.description = description;
        this.id = id;
        this.userID = userID;
    }

    toJSON(): any {
        const jsonObj: any = {"name": this.name, "themepark": this.themepark, "themeparkID": this.themeparkID, "date": this.date, "hour": this.hour, "description": this.description, "id": this.id}
        return jsonObj
    }
}

export {Event};