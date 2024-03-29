import { db } from "../database";
import { AttractionPreview, ThemeParkPreview } from "../attractions/Previews";
import Review from "../attractions/Review";


/* 
 * Get the first 3 items of attractions/themeparks/reviews
 * and mix them together.
 *
 * 
 * 
*/
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
            new ThemeParkPreview(value.name, value.country, value.id, value.userID)
          ),
        );
      }
    },
  );
}

/* 
*/
export function getRecents(getResult: (error: string | null, recents: any[] | null) => void) {
    getRecentReviews(function (error, recentReviews) {
        if(error) {
            getResult(error, null)
        }
        if(recentReviews) {
          getRecentAttractions(function (error, recentAttractions) {
            if(error) {
              getResult(error, null)
            } if(recentAttractions) {
              getRecentThemeparks(function (error, recentThemeParks) {
                if(error) {
                  getResult(error, null)
                } if(recentThemeParks) {
                  let results: any[] = []
                  results = results.concat(recentReviews, recentAttractions, recentThemeParks)
                  /**
                   * All items has a toJSON method
                   * polymorphism to the rescue!
                   */
                  results.map((val) => val.toJSON())
                  /**
                   * Randomly mix all items together
                   */
                  results.sort((a, b) => 0.5 - Math.random())
                  getResult(null, results)
                }
              })
            }
          })
        }
    })
}