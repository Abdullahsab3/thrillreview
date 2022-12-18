import { Event } from "./Event";
import { db, getEvent, getEvents, getEventAttendees, getEventsJoinedByUser } from "../database";

/*
-event aanmaken
-een event terug geven als je het id geeft
-events terug geven met pagination
-user laten deelnemen aan event
-de deelnemers van een event weergeven met pagination
-van een bepaalde user de events teug geven waaraan die meedoet
*/

// event toevoegen
function addEvent(req: any, res: any){
    const {
        name,
        themepark,
        date,
        hour,
        description,
    } = req.body;
    const userID = req.user.id;
    //eerst checken of alle info klopt/bestaat
    db.run(
        "INSERT INTO events (userID, name, themepark, date, hour, description) VALUES(?,?,?,?,?,?)",
        [
            userID,
            name,
            themepark,
            date,
            hour,
            description,
        ],
        (error: Error, result: any) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            } else {
                return res.json({ added: true });
            }
        }
    );
}

// gegeven een ID (in params) geef alle info van een event terug
function findEventByID(req: any, res: any){
    const id = req.params.eventID;
    getEvent(id, function (error: any, event: Event | null) {
        if (error) {
            return res.status(400).json({ error: error });
          }
          if (event) {
            return res.status(200).json(event.toJSON());
          } else {
            return res.status(400).json({
              eventID: "No event found with the given ID",
            });
          }
    });
}

// search voor events
function findEvents(req: any, res: any){
    var eventName = req.query.query;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    if (!eventName) { // indien naam niet meegegeven, zet als lege sting, wat als wildcard werkt
      eventName = "";
    }
    if (isNaN(page)) { // indien geen pagina gegeven zet pagina op 0, wat zelfde is als pagina 1
      page = 0;
    }
    if (isNaN(limit)) { // indien geen limiet gegeven, zet limiet op 0, geeft alles terug
      limit = 0;
    }
    getEvents(eventName, page, limit, function (error, result) {
      if (error) {
        res.status(400).json(error);
      } else if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ error: true, reviews: "No events found" });
      }
    });
}

// linkt een user aan een event (record toevoegen aan eventjoin table met link tussen userID en eventID)
function userJoinEvent(req: any, res: any){
    const eventID = req.params.eventID;
    const userID = req.body.user.id;
    db.run(
        "INSERT INTO eventjoin (eventID, userID) VALUES(?,?)",
        [
            eventID,
            userID,
        ],
        (error: Error, result: any) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            } else {
                return res.json({ added: true });
            }
        }
    );
}

// gegeven een event in params geeft terug of user meedoet aan event of niet
function userJoinedEvent(res: any, req: any){
    const eventID = req.params.eventID;
    const userID = req.user.id;
    db.get(
        "SELECT * FROM eventjoin where eventID = ? AND userID = ?",
        [
            eventID,
            userID
        ],
        function (error, result) {
            if (error) {
                return res.result(400).json({ error: "somting whent wrong while getting the attendees"});
            } else if (result) {
                return res.result(200).json({ result: true });
            } else {
                return res.result(200).json({ result: false});
            }
        }
    );
}

// geeft alle attendees van een event terug met pagination
function findEventUsers(req: any, res: any){
    const eventID = req.params.eventID;
    const userID = req.user.id;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    if (isNaN(page)) { //indien geen pagina pagina wodt 0, is zelfde als pagina 1
      page = 0;
    }
    if (isNaN(limit)) { // indien geen limiet gegeven, zet limiet op 0, geeft alles terug
      limit = 0;
    }
    getEvent(eventID, function (error: any, event: Event | null) {
        if (error) {
            return res.status(400).json({ error: error });
          }
          if (event) {
            if (event.userID === userID){ // kan enkel opgevraagd worden door de user die het event heeft aangemaakt
                getEventAttendees(eventID, page, limit, function (error, result) {
                    if (error) {
                      res.status(400).json(error);
                    } else if (result) {
                      res.status(200).json(result);
                    } else {
                      res.status(400).json({ error: true, reviews: "No events found" });
                    }
                  });
            } else {
                return res.status(503).json({ error: "FORBIDDEN only creator of event can see the attendees"})
            }
          } else {
            return res.status(400).json({
              eventID: "No event found with the given ID",
            });
          }
    });
}

// geeft het aantal deelnemers van een event terug
function eventAttendeesCount(req: any, res: any){
    const eventID = req.body.eventID;
    db.get(
        "SELECT COUNT(*) from eventjoin where eventID = ?",
        [ eventID ],
        function (error, countResult) {
            if (error) {
                return res.result(400).json({ error: "somting whent wrong while getting the attendees" });
            } else {
                return res.result(200).json({ result: countResult["COUNT(*)"] });
            }
        });
}

// geeft alle event mee waar een user aan deel neemt met pagination
function findUserJoinedEvents(req: any, res: any){
    const userID = req.user.id
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    if (isNaN(page)) { //indien geen pagina pagina wodt 0, is zelfde als pagina 1
      page = 0;
    }
    if (isNaN(limit)) { // indien geen limiet gegeven, zet limiet op 0, geeft alles terug
      limit = 0;
    }
    getEventsJoinedByUser(userID, page, limit, function (error, result) {
      if (error) {
        res.status(400).json(error);
      } else if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ error: true, reviews: "No events found" });
      }
    });
}

export { 
    addEvent, 
    findEventByID, 
    findEvents, 
    userJoinEvent,
    userJoinedEvent, 
    findEventUsers,
    eventAttendeesCount, 
    findUserJoinedEvents 
}
