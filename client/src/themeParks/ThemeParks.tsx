import { CardWithLinkTo }  from '../higherOrderComponents/cardWithLinkTo';


function ThemePark() {
    // theme park main page
    return (
        <div className="ContentOfPage">
            <h1> themeparks</h1>
            <CardWithLinkTo to="/browse-themeparks/" title="Browse all Theme parks"/>
            <CardWithLinkTo to="/addThemePark" title="Add a ThemePark" />
        </div>
    );
}

export default ThemePark;