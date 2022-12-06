import { Attraction } from "./Attraction";
import { db } from "./database";
import { AttractionPreview, ThemeParkPreview } from "./Previews";
import Review from "./Review";

export function getRecentReviews(
  getResult: (error: string | null, reviews: Review[] | null) => void,
) {
  db.all(
    "SELECT * FROM attractionreview ORDER BY DATE DESC LIMIT 3",
    function (error, result) {
      if (error) {
        getResult(
          "Something went wrong while trying to retrieve the most recent reviews",
          null,
        );
      }
      if (result) {
        getResult(
          null,
          result.map((value) =>
            new Review(
              value.attractionID,
              value.userID,
              value.review,
              value.stars,
              value.date,
            )
          ),
        );
      }
    },
  );
}

export function getRecentAttractions(
  getResult: (
    error: string | null,
    attractions: AttractionPreview[] | null,
  ) => void,
) {
  db.all(
    "SELECT * FROM attractions ORDER BY id DESC LIMIT 3",
    function (error, result) {
      if (error) {
        getResult(
          "Something went wrong while trying to retrieve the most recently added attractions",
          null,
        );
      }
      if (result) {
        getResult(
          null,
          result.map((value) =>
            new AttractionPreview(
              value.name,
              value.id,
              value.userID,
              value.themepark,
            )
          ),
        );
      }
    },
  );
}

export function getRecentThemeparks(
  getResult: (error: string | null, themeparks: ThemeParkPreview[] | null) => void,
) {
  db.all(
    "SELECT * FROM themeparks ORDER BY id DESC LIMIT 3",
    function (error, result) {
      if (error) {
        getResult(
          "Something went wrong while trying to retrieve the most recently added themeparks",
          null,
        );
      }
      if (result) {
        getResult(
          null,
          result.map((value) =>
            new ThemeParkPreview(value.name, value.id, value.userID)
          ),
        );
      }
    },
  );
}

export function getRecents(getResult: (error: string | null, recents: any[] | null) => void) {
    var results: any[] = []
    getRecentReviews(function (error, result) {
        if(error) {
            getResult(error, null)
        }
        if(result) {
            results = results.concat(result.map((review) => review.toJSON()))
        }
    })
    getRecentAttractions(function (error, result) {
        if(error) {
            getResult(error, null)
        }
        if(result) {
            results = results.concat(result.map((val) => val.toJSON()))
        }
    })
    getRecentThemeparks(function (error, result) {
        if(error) {
            getResult(error, null)
        }
        if(result) {
            results = results.concat(result.map((val) => val.toJSON()))
            getResult(null, results.sort((a, b) => 0.5 - Math.random()))
        }
    })


}