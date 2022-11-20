export default class Review {
    attractionID!: number;
    userID!: number;
    review!: string

    constructor(attractionID: number, userID: number, review: string) {
        this.attractionID = attractionID
        this.userID = userID
        this.review = review
    }
}