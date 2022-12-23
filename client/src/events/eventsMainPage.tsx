import { CardWithLinkTo }  from '../higherOrderComponents/cardWithLinkTo';

function EventsMainPage() {

    // the main page of events
    return (
        <div className="ContentOfPage">
            <h1> Events</h1>
            <CardWithLinkTo to="/browse-events/" title="Browse all Events"/>
            <CardWithLinkTo to="/addEvent" title="Add an Event" />

        </div>
    );
}

export default EventsMainPage;