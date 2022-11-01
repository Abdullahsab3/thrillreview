import { CardGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'

function Attractions() {

    function TopTenAttractions() {


        return(
            <Card>
                <Card.Body>
                    <Card.Title>Top Ten Attractions Rated by our users</Card.Title>
                    <Card.Text> Ik vermoed dat hier dan de top 10 komt, queryen naar serverside wss </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function NewestAttractions() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Newest Attractions</Card.Title>
                    <Card.Text> Ik vermoed dat hier dan de nieuwe komen, queryen naar serverside wss </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    function SearchAttractions() {
        return(
            <Card>
                <Card.Body>
                    <Card.Title>Search Attractions</Card.Title>
                    <Card.Text> een zoekding, queryen naar serverside </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div className='ContentOfPage'>
        <h1> attractions</h1>
        <CardGroup>
        <TopTenAttractions />
        <SearchAttractions />
        <NewestAttractions />
        </CardGroup>
        </div>

    );
}

export default Attractions;