export default class Review {
    attractionID!: number;
    userID!: number;
    review!: string
    date!: string

    constructor(attractionID: number, userID: number, review: string, date: string) {
        this.attractionID = attractionID
        this.userID = userID
        this.review = review
        this.date = date
    }
}