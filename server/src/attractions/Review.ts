export default class Review {
  attractionID!: number;
  userID!: number;
  review!: string;
  rating!: number;
  date!: string;

  constructor(
    attractionID: number,
    userID: number,
    review: string,
    rating: number,
    date: string,
  ) {
    this.attractionID = attractionID;
    this.userID = userID;
    this.review = review;
    this.rating = rating;
    this.date = date;
  }
  toJSON() {
    return {
        "type": "review",
        "attractionID": this.attractionID,
        "userID": this.userID,
        "review": this.review,
        "rating": this.rating,
        "date": this.date
    };
  }
}
