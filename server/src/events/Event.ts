class Event {
    name: string;
    themepark: string; //change to object in future
    date: string;
    hour: string;
    description: string;
    id: number;
    userID: number;
    
    constructor(name: string, themapark: string, date: string, hour: string, description: string, id: number, userID: number) {
        this.name = name;
        this.themepark = themapark;
        this.date = date;
        this.hour = hour;
        this.description = description;
        this.id = id;
        this.userID = userID;
    }

    toJSON(): any {
        const jsonObj: any = {"name": this.name, "themepark": this.themepark, "date": this.date, "hour": this.hour, "description": this.description, "id": this.id}
        return jsonObj
    }
}

export {Event};