class ThemePark {
    name: string;
    openingdate: string;
    street: string;
    streetNumber: number;
    postalCode: number;
    country: string;
    type: string;
    website: string;
    id: number;
    
    constructor(name: string, opingdate: string, street: string, streetNumber: number, postalCode: number, country: string,  type: string, website: string, id: number) {
        this.name = name;
        this.openingdate = opingdate;
        this.street = street;
        this.streetNumber = streetNumber;
        this.postalCode = postalCode;
        this.country = country
        this.type = type;
        this.website = website;
        this.id = id;
    }

    toJSON(): any {
        const jsonObj: any = {"name": this.name, "street": this.street, "streetNumber": this.streetNumber, "postalCode": this.postalCode, "country": this.country, "id": this.id}
        if(this.openingdate) {
            jsonObj.openingdate = this.openingdate
        }
        if(this.website) {
            jsonObj.website = this.website
        }
        if(this.type) {
            jsonObj.type = this.type
        }
        return jsonObj
    }
}

export {ThemePark};