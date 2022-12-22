import { FormEventHandler, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { Event } from './Event';
import ConnectThemePark from "../themeParks/connectThemeParks";


interface EventInputFormProps {
    title: string;
    text: string;
    validated: boolean;
    onFormSubmit: (e: Event) => FormEventHandler<HTMLFormElement>;
    event?: Event;
}

function EventInputForm(props: EventInputFormProps) {
    const [name, setName] = useState("");
    const [themepark, setThemePark] = useState("");
    const [themeparkName, setThemeparkName] = useState("Not yet chosen");
    const [themeParkSelected, setThemeParkSelected] = useState(false);
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [description, setDescription] = useState("");

    function connectedThemepark(id: number, thmprk: string) {
        const mouseEventHandler: React.MouseEventHandler<HTMLElement> = (ev: React.MouseEvent) => {
            setThemePark(id.toString());
            setThemeparkName(thmprk);
            setThemeParkSelected(true);
        }
        return mouseEventHandler;
    }
    

    function getId() {
        if(props.event){

            return props.event.id;
        } else return 0;
    }

    return (
        <div className="ContentOfPage">
            <Card>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.text}</Card.Text>
                    <Form className="align-items-center" validated={props.validated} onSubmit={props.onFormSubmit(new Event(getId(), name, date, hour, themepark, description))}>
                        <Form.Group>
                            <Form.Label>Name*</Form.Label>
                            <Form.Control required type="text" onChange={(e) => setName(e.target.value)} value={name} />
                            <Form.Control.Feedback type="invalid">
                                Name is required
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                                    <Form.Label>Theme park*</Form.Label>
                                    <InputGroup>
                                    <ConnectThemePark onClick={connectedThemepark} />
                                    <Form.Control  isValid={themeParkSelected} isInvalid={!themeParkSelected} required readOnly value={themeparkName}  />
                                    <Form.Control.Feedback type="invalid" >
                                        Theme park is required
                                    </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                        <Form.Group>
                            <Form.Label>Date*</Form.Label>
                            <Form.Control required type="date" onChange={(e) => setDate(e.target.value)} value={date} />
                            <Form.Control.Feedback type="invalid">
                                A date for your event is required
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Hour*</Form.Label>
                            <Form.Control required type="time" onChange={(e) => setHour(e.target.value)} value={hour}/>
                            <Form.Control.Feedback type="invalid">
                                Adding a start date for your event is required
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description*</Form.Label>
                            <Form.Control required as="textarea" onChange={(e) => setDescription(e.target.value)} value={description}/>
                            <Form.Control.Feedback type="invalid">
                                Adding a description for your event is required
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit">Submit event</Button>
                    </Form>
                </Card.Body>
            </Card>

        </div>
    );

}

export default EventInputForm;