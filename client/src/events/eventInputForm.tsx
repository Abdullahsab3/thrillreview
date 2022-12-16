import { FormEventHandler, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Event } from './Event';


interface EventInputFormProps {
    title: string;
    text: string;
    validated: boolean;
    onFormSubmit: (e: Event) => FormEventHandler<HTMLFormElement>;
    event?: Event;
}

function EventInputForm(props: EventInputFormProps) {
    const [name, setName] = useState("")
    const [themepark, setThemePark] = useState("")
    const [date, setDate] = useState("")
    const [hour, setHour] = useState("")
    const [description, setDescription] = useState("")

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
                            <Form.Label>Theme Park*</Form.Label>
                            <Form.Control required type="text" onChange={(e) => setThemePark(e.target.value)} value={themepark} />
                            <Form.Control.Feedback type="invalid">
                                Theme park is required
                            </Form.Control.Feedback>
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
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" onChange={(e) => setDescription(e.target.value)} value={description}/>
                        </Form.Group>
                        <Button type="submit">Submit event</Button>
                    </Form>
                </Card.Body>
            </Card>

        </div>
    );

}

export default EventInputForm;