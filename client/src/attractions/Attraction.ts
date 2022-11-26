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
}

export {Attraction};