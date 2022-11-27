class Attraction {
    name: string;
    themepark: string; //change to object in future
    openingdate: string;
    builder: string;
    type: string;
    height: string;
    length: string;
    inversions: string;
    duration: string;
    id: number;
    
    constructor(name: string, themapark: string, opingdate: string, builder: string, type: string, 
                height: string, lenght: string, inversions: string, duration: string, id: number) {
        this.name = name;
        this.themepark = themapark;
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
        const jsonObj: any = {"name": this.name, "themepark": this.themepark, "id": this.id}
        if(this.openingdate) {
            jsonObj.openingdate = this.openingdate
        }
        if(this.builder) {
            jsonObj.builder = this.builder
        }
        if(this.type) {
            jsonObj.type = this.type
        }
        if(this.height) {
            jsonObj.height = this.height
        }
        if(this.length) {
            jsonObj.length = this.length
        }
        if(this.inversions) {
            jsonObj.inversions = this.inversions
        }
        if(this.duration) {
            jsonObj.duration = this.duration
        }
        return jsonObj
    }
}

export {Attraction};