class Event {
    name: string;
    date: string;
    hour: string;
    themepark: string;
    description: string;
    id: number;

    constructor(id:number, name: string, date:string, hour:string, themepark:string, description:string){
        this.name=name;
        this.date=date;
        this.hour=hour;
        this.themepark=themepark;
        this.description=description;
        this.id=id;
    }

    toJSON(): any {
        return {"name": this.name, "date": this.date, "hour": this.hour,
                "themepark":this.themepark, "description":this.description}; 
    }
}

export {Event};