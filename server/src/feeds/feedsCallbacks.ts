import { getRecents } from "./home";

export function sendFeeds(req: any, res: any) {
  getRecents(function (error, results) {
    if (error) {
      res.status(400).json({ error: error });
    }
    if (results) {
      res.status(200).json({ feeds: results });
    }
  });
}
