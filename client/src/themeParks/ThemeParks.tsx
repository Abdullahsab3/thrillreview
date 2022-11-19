import CardWithLinkTo from '../higherOrderComponents/HigherOrderComponents';


function ThemePark() {
    return (
        <div>
            <h1> themeparks</h1>
            <CardWithLinkTo to="/addThemePark" title="Add a ThemePark" />

        </div>





    );
}

export default ThemePark;